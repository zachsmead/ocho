import React from 'react';
import firebase from 'firebase/app';
import firebaseConfig from 'config/firebaseConfig.js';
import { BrowserRouter as Router } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'reactstrap';
import Modal from 'react-modal';

import Interface from './Interface';
import  './App.css';

Modal.setAppElement('#root')


class App extends React.Component {
  state = {
    loading: true,
    info: false,
    link: '',
    url: '',
    modalIsOpen: false
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

  openModal() {
    this.setState({modalIsOpen: true});
  }

  closeModal() {
    this.setState({modalIsOpen: false});
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
              <text
                class='about-link'
                style={{cursor:'pointer'}}
                onClick={() => this.openModal()}
              >
                about this site
              </text>
            </Col>
          </Row>
          <Modal
            isOpen={this.state.modalIsOpen}
            onRequestClose={() => this.closeModal()}
            style={modalStyles}
            contentLabel="Example Modal"
            closeTimeoutMS={150}
          >
            <Container fluid style={{width: '100%'}}>
              <Row style={{ flex: 2}}>
                <Col md={{ size: 12 }}>
                  <text
                    class='about-header'
                  >
                    ocho
                  </text>
                </Col>
              </Row>
              <Row style={{ flex: 1}}>
                <Col md={{ size: 12 }}>
                  <text
                    class='about-subheader'
                  >
                    URLs in 8 characters or less.
                  </text>
                </Col>
              </Row>
              <Row style={{ flex: 5}}>
                <Col md={{ size: 10, offset: 1 }}>
                  <div class='about-content'>
                    <text >
                      <div class='about-subcontent'>
                        This is a simple tool for turning long URLs into short ones that are easy to copy-paste.
                        It's made with React and Firestore, and generates a random string to redirect to any given URL.
                      </div>
                      <div class='about-subcontent'>
                        There are 62 characters to choose from when generating a random string.
                        That's a lot of options!
                        With 6 character slots, there are 56,800,235,584 (~57 billion) unique combinations.
                        With 7 character slots, there are 3,521,614,600,000 (~3.5 trillion) combinations.
                        With 8 slots, there are 218,340,110,000,000 (~218 trillion) combinations.
                      </div>
                      <div class='about-subcontent'>
                        This site is owned and maintained by <a href='https://zachsmead.com'>Zach Smead</a>.
                      </div>
                    </text>
                  </div>
                </Col>
              </Row>
              <Row style={{ flex: 1}}>
                <Col md={{ flex: 1, size: 12 }} style={{ padding: 10 }}>
                  <text
                    class='about-link'
                    style={{cursor:'pointer'}}
                    onClick={() => this.closeModal()}
                  >
                    close
                  </text>
                </Col>
              </Row>
            </Container>
          </Modal>
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

const modalStyles = {
  content : {
    top: 'auto',
    right: 'auto',
    bottom: 'auto',
    left: 'auto',
    width: '100%',
    height: '100%',
    border: 'none',
    padding: '0px',
    backgroundColor: '#f7f7f7'
  }
};

export default App;
