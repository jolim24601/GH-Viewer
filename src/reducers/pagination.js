import { combineReducers } from 'redux-immutablejs';
import { Map } from 'immutable';
import { ISSUES_REQUEST, ISSUES_SUCCESS, ISSUES_FAILURE } from '../actions';

const initialState = Map({
  isFetching: false,
  nextPageUrl: '',
  lastPageUrl: '',
  pageCount: 0
});

export default (state = initialState, action) => {
  switch (action.type) {
    case ISSUES_REQUEST:
      return state.merge({
        isFetching: true
      });
    case ISSUES_SUCCESS:
      const response = action.response;
      return state.merge({
        isFetching: false,
        nextPageUrl: response.get('nextPageUrl'),
        lastPageUrl: response.get('lastPageUrl'),
        pageCount: state.get('pageCount') + 1
      });
    case ISSUES_FAILURE:
      return state.merge({
        isFetching: false
      });
    default:
      return state;
  }
};
