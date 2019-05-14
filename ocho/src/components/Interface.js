import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { withRouter } from 'react-router-dom'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Container, Row, Col } from 'reactstrap';


import getRandomString from 'helpers/getRandomString';

import './Interface.css';

const fadeDuration = 10; // this is from an online example, not sure where to put it.


class Interface extends React.Component {
  state = {
    url: '',
    urlWithProtocol: '',
    error: '',
    shortened: false,
    copied: false,
  };

  componentWillMount = () => {
    console.log(this.state);
  }

  addProtocol = url => {
    var protocolOk = url.startsWith("http://") || url.startsWith("https://") || url.startsWith("ftp://");

    if (!protocolOk) {
      const newurl = "http://" + url;
      return newurl
    } else {
      return url
    }
  }

  generateErrorMessage() {
    this.setState({ error: 'Sorry, that URL is invalid.'});
  }

  validate = url => {
    // make sure the url is not too short already, is not from domain ocho.at, and has a valid suffix
    if ((url.length < 3) || (!url) || (url === '')) {
        this.generateErrorMessage();
        return false;
    } else if (!url.includes('.')) {
        this.generateErrorMessage();
        return false;
    } else if (
      url.startsWith('http://ocho.at')
      || url.startsWith('https://ocho.at')
      || url.startsWith('ftp://ocho.at')
      || url.startsWith('ocho.at')
      || url.startsWith('http://www.ocho.at')
      || url.startsWith('https://www.ocho.at')
      || url.startsWith('ftp://www.ocho.at')
      || url.startsWith('www.ocho.at')
    ) {
        this.generateErrorMessage();
        return false;
    } else if (url.charAt(url.length - 2) === '.' || url.charAt(url.length - 1) === '.') {
        this.generateErrorMessage();
        return false;
    } else if (url.charAt(0) === '.') {
        this.generateErrorMessage();
        return false;
    }

    return true; // finally, if no errors were found, return true.
  }

  onFormSubmit = event => {
    event.preventDefault(); // prevent page reload

    this.createShortenedURL();
  };

  createShortenedURL = async => {
    // first, in case previously there was an error, we want to reset error to a blank string.
    this.setState({ error: '' });

    // check the url protocol and add protocol if need be
    const url = this.state.url;

    // validate the url
    const valid = this.validate(url);

    if (valid) {
      // add protocol ('http://' prefix) to the url first, if needed
      const urlWithProtocol = this.addProtocol(url);

      // generate the short, random id for the url
      const id = getRandomString(); // get a random string

      // make the shortened URL link
      const short = 'ocho.at/' + id;

      // generate an object that contains the original + shortened url
      const item = {
        url: urlWithProtocol,
        link: short
      }

      const doc = firebase.firestore().collection('urls').doc(id);
      // which is faster - to check this way if the object already exists,
      // or to create a collection of 'forbidden' document ids and check that every time?
      // i think it depends on the number of operations, but i do not know those numbers.
      const getDoc = doc.get()
        .then(doc => {
          if (doc.exists) { // if the doc already exists, get another random string
            this.createShortenedURL();
          } else {
            firebase.firestore().collection('urls').doc(id).set(item).then(res => { // doc(id) creates a doc with id equal to the short random string. .set() sets that docs attributes.
              this.setState({ url: short, error: '', shortened: true });
            });
          }
        })
        .catch(err => {
            console.log('Error checking document', err);
        });
    }
  };

  renderCopyButton() {
    if (this.state.shortened && this.state.copied) {
      return (
        <CopyToClipboard
          text={this.state.url}>
          <text className='link' style={{cursor:'pointer'}}>Copied!</text>
        </CopyToClipboard>
      );
    }

    if (this.state.shortened) {
      return (
        <CopyToClipboard
          text={this.state.url}
          onCopy={() => this.setState({copied: true})}>
          <text className='link' style={{cursor:'pointer'}}>Copy link</text>
        </CopyToClipboard>
      );
    }
  }

  renderError() {
    if (this.state.error) {
      return (
        <CSSTransitionGroup
          transitionName='error'
        >
          <Col md="12">
            {this.state.error}
          </Col>
        </CSSTransitionGroup>
      )
    }
  }

  render() {
    console.log(this.state);

    return (
      <Container fluid>
        <Row style={{ flex: 1}}>

        </Row>
        <Row style={{ flex: 1 }}>
          <Col md={{ size: 6, offset: 3 }} style={{ padding: 10 }}>
            <div>
              <form onSubmit={this.onFormSubmit}>
                <input
                  className="text-input"
                  type="text"
                  placeholder='Enter a URL'
                  value={this.state.url}
                  onChange={e => this.setState({ url: e.target.value, shortened: false, copied: false, error: '' })}
                />
              </form>
            </div>
          </Col>
          <Col md="auto" style={{ padding: 20, paddingTop: 34 }}>
            {this.renderCopyButton()}
          </Col>
        </Row>
        <Row style={{ flex: 1, color: 'grey' }}>
          {this.renderError()}
        </Row>
      </Container>
    );
  }
}

export default withRouter(Interface);
