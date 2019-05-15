import React from 'react';
import { CSSTransition } from 'react-transition-group';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { withRouter } from 'react-router-dom'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Container, Row, Col } from 'reactstrap';

import './Interface.css';

import getRandomString from 'helpers/getRandomString';


class Interface extends React.Component {
  state = {
    url: '',
    urlWithProtocol: '',
    error: '',
    showError: false,
    errorTimeoutId: 0, // the error message timeout ID that controls the automatic fadeout animation
    shortened: false,
    loading: false,
    copyButtonText: 'Copy',
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

  errorTimeout() {
    const errorTimeoutId = window.setTimeout(() => { // function which initiates the fade out of the error message
      this.setState({ showError: false, errorTimeoutId });
    }, 1800 );

    return errorTimeoutId;
  }

  generateErrorMessage() {
    this.setState({ error: 'Sorry, that URL is invalid.', showError: true});

    clearTimeout(this.state.errorTimeoutId); // clear the previous error timeout animation

    const newErrorTimeout = this.errorTimeout();

    this.setState({ errorTimeoutId: newErrorTimeout });
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
    this.setState({ showError: false });

    // check the url protocol and add protocol if need be
    const url = this.state.url;

    // validate the url
    const valid = this.validate(url);

    if (valid) {
      this.setState({ loading: true, copyButtonText: 'Copy' })

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
              this.setState({ url: short, shortened: true, loading: false });
            });
          }
        })
        .catch(err => {
            console.log('Error checking document', err);
        });
    }
  };

  renderCopyButton() {
    if (this.state.loading) {
      return (
        <CopyToClipboard
          text={this.state.url}>
          <text style={{ color: 'grey' }}>Loading...</text>
        </CopyToClipboard>
      );
    }

    return (
      <CSSTransition
        in={this.state.shortened}
        timeout={350}
        classNames="copy"
        unmountOnExit
      >
        <CopyToClipboard
          text={this.state.url}
          onCopy={() => this.setState({copyButtonText: 'Copied!'})}
        >
          <text className='link' style={{cursor:'pointer'}}>
            {this.state.copyButtonText}
          </text>
        </CopyToClipboard>
      </CSSTransition>
    );
  }

  renderError() {
    return (
      <Col md="12">
        <CSSTransition
          in={this.state.showError}
          timeout={370}
          classNames="errorMessage"
          unmountOnExit
        >
          <div>
            {this.state.error}
          </div>
        </CSSTransition>
      </Col>
    )
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
                  onChange={e => this.setState({ url: e.target.value, shortened: false })}
                />
              </form>
            </div>
          </Col>
          <Col md="auto">
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
