import React from 'react';
import firebase from 'firebase';
import 'firebaseConfig' from '../../firebaseConfig.js'

class App extends Component {
  componentWillMount() {
    firebase.initializeApp(firebaseConfig);
  }

  render() {
    return (
      <View>
        <Header headerText="Authentication" />
        {this.renderContent()}
      </View>
    );
  }
}

export default App;
