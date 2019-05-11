import React from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';

class Input extends React.Component {
  state = {
    url: '',
    error: ''
  };

  getRandom = () => {
    const rand = Math.random(); // generate random number to determine string length
    const lengths = [
      { length: 6, min: 0, max: 0.68 }, // setting probabilities of string lengths
      { length: 7, min: 0.68, max: 0.925 },
      { length: 8, min: 925, max: 1 }
    ];
    const length = lengths.forEach(e => { // get string length
      if (e.min < rand && rand <= e.max) { // if rand falls in the min-max range
        return e.length;
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

    // but if it already exists as a key in firebase, do this over again
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

  validate = url  => {
    // make sure the url is not too short already, nor is it from domain ocho.at
    if (
      (url.length < 16)
    ) {
      this.setState({ error: 'Enter a longer URL'});
    } else if (
      url.startsWith('http://ocho.at')
      || url.startsWith('https://ocho.at')
      || url.startsWith('ftp://ocho.at')
      || url.startsWith('ocho.at')
      || url.startsWith('http://www.ocho.at')
      || url.startsWith('https://www.ocho.at')
      || url.startsWith('ftp://www.ocho.at')
      || url.startsWith('www.ocho.at')
    ) {
      this.setState({ error: 'Invalid URL'});
    }

    return this.checkProtocol(url); // return the url with protocol added, if need be
  }

  onFormSubmit = event => {
    event.preventDefault(); // prevent page reload

    this.onURLSubmit();
  };

  onURLSubmit = async => {
    // validate the url
    const url = this.validate(this.state.url);

    if (!this.state.error) {
      // generate the short, random id for the url
      const id = this.getRandom(); // get a random string

      // make the shortened URL link
      const short = 'ocho.at/' + id;

      // generate an object that contains the original + shortened url
      const item = {
        url: url,
        link: short
      }

      // in firebase, save that object under the short random id
      firebase.firestore().collection('urls').doc(id).set(item).then(res => { // doc(id) creates a doc with id equal to the word itself. .set() sets that docs attributes.
        this.setState({ url: short, error: '' });
      });
    }

  };

  render() {
    return (
      <div className="ui segment">
        <form onSubmit={this.onFormSubmit} className="ui form">
          <div className="field">
            <input
              type="text"
              placeholder='Enter a URL'
              value={this.state.url}
              onChange={e => this.setState({ url: e.target.value })}
            />
          </div>
        </form>
      </div>
    );
  }
}

export default Input;
