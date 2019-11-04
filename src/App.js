import React, { Component } from 'react';
//import Visualiser from './components/Visualiser';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import reducers from './reducers';

const initialState = {
  // colours: ['000000', '111111', '222222'],
  // product: null,
  // variant: null,
  // coloursLoading: true,
  // primaryImageUrl: null,
  // modal: null,
  // countFullsizeLoaded: 0,
  // patternLoaded: false
};

// Create Redux state store (ReduxThunk middleware allows us to have asynchronous actions).
const store = createStore(reducers, initialState, applyMiddleware(reduxThunk));

class App extends Component {

  //// <Visualiser {...this.props} />
  render() {
    return (
      <Provider store={store}>
        <h1>Testing</h1>
      </Provider>
    );
  }
}

export default App;