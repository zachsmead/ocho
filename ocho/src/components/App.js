import React from 'react';
import firebase from 'firebase/app';
import firebaseConfig from 'config/firebaseConfig.js';
import { BrowserRouter as Router } from "react-router-dom";
import Input from './Input';

class App extends React.Component {
  state = {
    loading: true
  }

  componentWillMount() {
    if(!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig)
      this.routeChange();
    }
  }

  routeChange() {
    console.log(window.location);
    const id = window.location.pathname.slice(1);
    console.log(id);

    if (id) {
      const doc = firebase.firestore().collection('urls').doc(id);
      const getDoc = doc.get()
      .then(doc => {
        if (doc.exists) { // if the doc id exists, redirect to its url
          let newPath = doc.data().url
          window.location = newPath;
        } else { // if it doesn't exist, set loading = false and render normally
          this.setState({ loading: false });
        }
      })
      .catch(err => {
        console.log('Error checking document', err);
      });
    } else { // if no pathname, set loading to false
      this.setState({ loading: false });
    }
  }

  renderContent() {
    if (!this.state.loading) {
      return (
        <div className="ui container" style={{ marginTop: '10px' }}>
          <Input />
        </div>
      );
    }
  }

  render() {
    return (
      <Router>
        {this.renderContent()}
      </Router>
    );
  }
}

export default App;
