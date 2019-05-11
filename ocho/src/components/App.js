import React from 'react';
import firebase from 'firebase/app';
import firebaseConfig from 'config/firebaseConfig.js';
import { BrowserRouter as Router } from "react-router-dom";
import Input from './Input';

class App extends React.Component {
  componentWillMount() {
    if(!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig)
      this.routeChange();
    }
  }

  routeChange() {
    console.log(window.location);
    console.log(window.location.pathname);
    if (window.location.pathway) {
      const id = window.location.pathname;
      console.log(id);

      const doc = firebase.firestore().collection('urls').doc(id);
      const getDoc = doc.get()
      .then(doc => {
        if (doc.exists) { // if the doc already exists, get another random string
          let newPath = doc.data.url
          console.log(newPath);
          // this.props.history.push(newPath);
        } else {
        }
      })
      .catch(err => {
        console.log('Error checking document', err);
      });
    }
  }

  render() {
    return (
      <Router>
        <div className="ui container" style={{ marginTop: '10px' }}>
          <Input />
        </div>
      </Router>
    );
  }
}

export default App;
