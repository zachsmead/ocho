import React from 'react';
import firebase from 'firebase/app';
import firebaseConfig from 'config/firebaseConfig.js';
import Input from './Input';

class App extends React.Component {
  state = {
    url: '',
    short: ''
  };

  componentWillMount() {
    firebase.initializeApp(firebaseConfig);
  }

  onURLSubmit = async url => {
    // shorten the URL and save it in firebase

    this.setState({ short: url }); // change this later to short
  };

  render() {
    return (
      <div className="ui container" style={{ marginTop: '10px' }}>
        <Input onSubmit={this.onSearchSubmit} />
      </div>
    );
  }
}

export default App;
