import React from 'react';
import firebase from 'firebase/app';
import firebaseConfig from 'config/firebaseConfig.js';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import queryString from 'query-string';
import Input from './Input';

class App extends React.Component {
  componentWillMount() {
    firebase.initializeApp(firebaseConfig);
  }

  routeChange() {
    let params = queryString.parse(this.props.location.search)
    console.log(params);
    let path = `newPath`;
    this.props.history.push(path);
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
