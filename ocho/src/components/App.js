import React from 'react';
import firebase from 'firebase/app';
import firebaseConfig from 'config/firebaseConfig.js';
import { BrowserRouter as Router } from "react-router-dom";
import Input from './Input';

class App extends React.Component {
  componentWillMount() {
    this.routeChange();
    firebase.initializeApp(firebaseConfig);
  }

  routeChange() {
    console.log(window.location);
    console.log(window.location.pathname);
    // let params = new URLSearchParams(window.location.search);
    // let path = `newPath`;
    // this.props.history.push(path);
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
