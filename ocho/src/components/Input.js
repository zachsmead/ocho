import React from 'react';
import firebase from 'firebase/app';

class Input extends React.Component {
  state = { url: '' };

  getRandom = () => {
    var randomString = Math.random().toString(32).substring(2, 5) + Math.random().toString(32).substring(2, 5);
    console.log(randomString);
    return randomString()
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
