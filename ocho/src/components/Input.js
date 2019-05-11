import React from 'react';
import firebase from 'firebase/app';

class Input extends React.Component {
  state = { url: '' };

  onFormSubmit = event => {
    event.preventDefault();

    this.props.onURLSubmit();
  };

  onURLSubmit = async url => {
    // shorten the URL and save it in firebase

    this.setState({ url: url }); // change this later to short
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
