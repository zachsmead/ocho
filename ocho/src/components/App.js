import React from 'react';
import firebase from 'firebase/app';
import firebaseConfig from 'config/firebaseConfig.js';
import { BrowserRouter as Router } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'reactstrap';
import Interface from './Interface';

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
    var id = window.location.pathname; // get the stuff after the '/' in 'ocho.at/'

    console.log(id);

    if (id && id.startsWith('/info/')) { // slice out unnecessary characters and determine if we want info about a given id
      id = id.slice(6);
      console.log(id);
      this.setState({ info: true });
      console.log(this.state);
    } else {
      id = id.slice(1);
    }

    if (id && !id.includes('/')) {
      const doc = firebase.firestore().collection('urls').doc(id);
      const getDoc = doc.get()
      .then(doc => {
        if (doc.exists) { // if the doc id exists... and '/info/' is not in the pathname (the URL bar), redirect.
          if (this.state.info) { // if info is selected, we want the doc's data to render on this page.
            this.setState({ loading: false, url: doc.data().url, link: doc.data().link });
          } else { // if info is not selected, we want to redirect to the url associated with the given id.
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
    } else { // if no pathname, or an invalid pathname, set loading to false and render normally
      this.setState({ loading: false });
    }
  }

  renderContent() {
    if (!this.state.loading) {
      if (this.state.info) { // if info is in the URL bar, render a json with the original url and shortened link
        const { link, url } = this.state;
        const data = { link, url };
        console.log(data);
        return <div style={{ textAlign: 'left' }}><pre>{JSON.stringify(data, null, 2) }</pre></div>;
      }
      return ( // otherwise render the normal interface
        <Container fluid>
          <Row style={{ flex: 8}}>
            <Interface />
          </Row>
          <Row style={{ flex: 1}}>
            <Col md={{ size: 12 }} style={{ padding: 10 }}>
              <text class='about-link' style={{cursor:'pointer'}}>about this site</text>
            </Col>
          </Row>
        </Container>
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
