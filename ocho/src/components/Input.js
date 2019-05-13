import React from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { withRouter } from 'react-router-dom'
import {CopyToClipboard} from 'react-copy-to-clipboard';


class Input extends React.Component {
  state = {
    url: '',
    error: '',
    shortened: false
  };

  componentWillMount = () => {
    console.log(this.state);
  }

  getRandom = () => {
    const rand = Math.random(); // generate random number to determine string length
    const lengths = [
      { length: 6, min: 0, max: 0.68 }, // setting probabilities of string lengths
      { length: 7, min: 0.68, max: 0.925 },
      { length: 8, min: 925, max: 1 }
    ];
    var length = 0;
    lengths.forEach(e => { // determine string length using rand
      if (rand <= e.max) { // if rand falls in the min-max range
        length = e.length;
      }
    });
    var randomString = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    // there are 62 characters to choose from when generating a random string.
    // with 6 character slots, there are 56,800,235,584 (~57 billion) unique combinations.
    // with 7 character slots, there are 3.5216146e+12 -- 3,521,614,600,000 (~3.5 trillion) unique combinations.
    // with 8 character slots, there are 2.1834011e+14 -- 218,340,110,000,000 (~220 trillion) unique combinations.
    console.log(possible.length);

    for (var i = 0; i < length; i++)
        randomString += possible.charAt(Math.floor(Math.random() * possible.length));

    // return randomString so we can save as a key in firebase.
    console.log(randomString);
    return randomString;
  }

  checkProtocol = url => {
    var protocolOk = url.startsWith("http://") || url.startsWith("https://") || url.startsWith("ftp://");

    if (!protocolOk) {
      const newurl = "http://" + url;
      return newurl;
    } else {
      return url;
    }
  }

  validate = url => {
    // check the url protocol and add protocol if need be
    const urlWithProtocol = this.checkProtocol(url);
    console.log('urlWithProtocol: ', urlWithProtocol);
    console.log('urlWithProtocol.charAt(urlWithProtocol.length - 2): ', urlWithProtocol.charAt(urlWithProtocol.length - 2));
    // make sure the url is not too short already, is not from domain ocho.at, and has a valid suffix

    if (
      (url.length < 3) || (!url) || (url === '')
    ) {
      this.setState({ error: 'That URL is invalid.'});
      return false;
    } else if (
      urlWithProtocol.startsWith('http://ocho.at')
      || urlWithProtocol.startsWith('https://ocho.at')
      || urlWithProtocol.startsWith('ftp://ocho.at')
      || urlWithProtocol.startsWith('ocho.at')
      || urlWithProtocol.startsWith('http://www.ocho.at')
      || urlWithProtocol.startsWith('https://www.ocho.at')
      || urlWithProtocol.startsWith('ftp://www.ocho.at')
      || urlWithProtocol.startsWith('www.ocho.at')
    ) {
        this.setState({ error: 'That URL is invalid.'});
        return false;
    } else if (urlWithProtocol.charAt(urlWithProtocol.length - 2) === '.') {
        this.setState({ error: 'That URL is invalid.'});
        return false;
    }

    // if no errors were found, but previously there was an error, reset error to a blank string.
    if (this.state.error !== '') {
      this.setState({ error: '' });
    }

    return true; // finally, return true if no errors were found.
  }

  onFormSubmit = event => {
    event.preventDefault(); // prevent page reload

    this.onURLSubmit();
  };

  onURLSubmit = async => {
    // check the url protocol and add protocol if need be
    const url = this.state.url;

    // validate the url with protocol added
    const valid = this.validate(url);

    if (valid) {
      // generate the short, random id for the url
      const id = this.getRandom(); // get a random string

      // make the shortened URL link
      const short = 'ocho.at/' + id;

      // generate an object that contains the original + shortened url
      const item = {
        url: url,
        link: short
      }

      const doc = firebase.firestore().collection('urls').doc(id);
      // which is faster - to check this way if the object already exists,
      // or to create a collection of 'forbidden' document ids and check that every time?
      // i think it depends on the number of operations, but i do not know those numbers.
      const getDoc = doc.get()
        .then(doc => {
          if (doc.exists) { // if the doc already exists, get another random string
            this.onURLSubmit();
          } else {
            firebase.firestore().collection('urls').doc(id).set(item).then(res => { // doc(id) creates a doc with id equal to the short random string. .set() sets that docs attributes.
              this.setState({ url: short, error: '', shortened: true });
            });
          }
        })
        .catch(err => {
            console.log('Error checking document', err);
        });
    }
  };

  renderCopyButton() {
    if (this.state.shortened) {
      return (
        <CopyToClipboard text={this.state.url}>
          <text>Copy</text>
        </CopyToClipboard>
      );
    }
  }

  render() {
    console.log(this.state);

    return (
      <div className="ui segment">
        <form onSubmit={this.onFormSubmit} className="ui form">
          <div className="field">
            <input
              type="text"
              placeholder='Enter a URL'
              value={this.state.url}
              onChange={e => this.setState({ url: e.target.value, shortened: false })}
            />
          </div>
        </form>
        <div>
          {this.state.error}
        </div>
        {this.renderCopyButton()}
      </div>
    );
  }
}

export default withRouter(Input);
