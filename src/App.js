import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';

import reducers from './reducers';
import Visualiser from './components/Visualiser';

const initialState = {
  variant: null
};

// Create Redux state store (ReduxThunk middleware allows us to have asynchronous actions).
const store = createStore(reducers, initialState, applyMiddleware(reduxThunk));

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Visualiser {...this.props} />
      </Provider>
    );
  }
}

export default App;