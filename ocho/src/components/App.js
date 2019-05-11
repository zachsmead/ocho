import React from 'react';
import firebase from 'firebase/app';
import firebaseConfig from 'config/firebaseConfig.js';
import { withRouter } from 'react-router-dom';
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
      <div className="ui container" style={{ marginTop: '10px' }}>
        <Input />
      </div>
    );
  }
}

export default withRouter(App);
