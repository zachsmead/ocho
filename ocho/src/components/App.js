import React from 'react';
import firebase from 'firebase/app';
import firebaseConfig from 'config/firebaseConfig.js';
import { BrowserRouter as Router } from "react-router-dom";
import Input from './Input';

class App extends React.Component {
  state = {
    loading: true,
    info: false,
    link: '',
    url: ''
  }

  componentWillMount() {
    if(!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig)
      this.routeChange();
    }
  }

  routeChange() {
    console.log(window.location);
    var id = window.location.pathname;

    console.log(id);

    if (id && id.startsWith('/info/')) {
      id = id.slice(6);
      console.log(id);
      this.setState({ info: true });
      console.log(this.state);
      // var info = true;
    } else {
      id = id.slice(1);
    }

    if (id) {
      const doc = firebase.firestore().collection('urls').doc(id);
      const getDoc = doc.get()
      .then(doc => {
        if (doc.exists) { // if the doc id exists and '/info/' is not in the pathname (the URL bar), redirect.
          if (this.state.info) {
            this.setState({ loading: false, url: doc.data().url, link: doc.data().link });
          } else {
            let newPath = doc.data().url;
            window.location = newPath;
          }
        } else { // if the id doesn't exist, set loading = false and render normally
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
      if (this.state.info) {
        const { link, url } = this.state;
        const data = { link, url };
        console.log(data);
        return <div><pre>{JSON.stringify(data, null, 2) }</pre></div>;
      }
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
