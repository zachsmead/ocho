import React from 'react';
import firebase from 'firebase';
import firebaseConfig from '../../firebaseConfig.js';

class App extends React.Component {
  componentWillMount() {
    firebase.initializeApp(firebaseConfig);
  }

  render() {
    return (
      <div>
      </div>
    );
  }
}

export default App;
