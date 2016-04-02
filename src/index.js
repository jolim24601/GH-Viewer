import React from 'react';
import { render } from 'react-dom';
import { browserHistory } from 'react-router';
import Root from './containers/Root';
import configureStore from './store/configureStore';
import { Map } from 'immutable';
import { syncHistoryWithStore } from 'react-router-redux';

const initialState = Map();

const store = configureStore(initialState);
const history = syncHistoryWithStore(browserHistory, store, {
  selectLocationState: (state) => state.get('router').toJS()
});

render(
  <Root store={store} history={history} />,
  document.getElementById('root')
);
