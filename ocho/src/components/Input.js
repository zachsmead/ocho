import React from 'react';
import firebase from 'firebase/app';

class Input extends React.Component {
  state = { url: '' };

  getRandom = () => {
    var randomString = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    console.log(possible.length);

    for (var i = 0; i < 8; i++)
        randomString += possible.charAt(Math.floor(Math.random() * possible.length));

    // if the randomString doesn't already exist as a key in firebase, return it
    return randomString;

    // otherwise do it over again
  }


  onFormSubmit = event => {
    event.preventDefault();

    this.onURLSubmit();
  };

  onURLSubmit = async => {
    const random = this.getRandom();
    console.log(random);

    // shorten the URL
    const short = this.state.url;

    // save the shortened URL in firebase

    this.setState({ url: short }); // change this later to short
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
