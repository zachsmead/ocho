import React from 'react';
import firebase from 'firebase/app';
import firebaseConfig from 'config/firebaseConfig.js';
import Input from './Input';

class App extends React.Component {
  componentWillMount() {
    firebase.initializeApp(firebaseConfig);
  }

  render() {
    return (
      <div className="ui container" style={{ marginTop: '10px' }}>
        <Input />
      </div>
    );
  }
}

export default App;
