import React from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';

class Input extends React.Component {
  state = { url: '' };

  getRandom = () => {
    const lengths = [6, 6, 7, 7, 8]
    const length = lengths[Math.floor(Math.random() * lengths.length)];
    var randomString = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    // there are 62 characters to choose from when generating a random string.
    // with 8 character slots, there are 2.1834011e+14 unique combinations.

    console.log(possible.length);

    for (var i = 0; i < length; i++)
        randomString += possible.charAt(Math.floor(Math.random() * possible.length));

    // return randomString so we can save as a key in firebase.
    console.log(randomString);
    return randomString;

    // but if it already exists as a key in firebase, do this over again
  }


  onFormSubmit = event => {
    event.preventDefault(); // prevent page reload

    this.onURLSubmit();
  };

  onURLSubmit = async => {
    const url = this.state.url;

    // generate the shortened id for the url
    const id = this.getRandom(); // get a random string

    // generate the object with the original url to save in firestore
    const item = {
      url: url
    }
    // save the shortened URL in firebase
    firebase.firestore().collection('urls').doc(id).set(item).then(res => { // doc(id) creates a doc with id equal to the word itself. .set() sets that docs attributes.
      // shorten the URL
      const short = 'ocho.at/' + id;
      this.setState({ url: short });
    });

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
