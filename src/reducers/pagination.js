import { Map } from 'immutable';
import * as ActionTypes from '../actions';

const initialState = Map({
  isFetching: false,
  quietFetching: false,
  pageUrls: Map(),
  nextPageUrls: Map(),
  owner: 'npm',
  repo: 'npm',
  page: -1
});

export default (state = initialState, action) => {
  const response = action.response;

  switch (action.type) {
    case ActionTypes.ISSUES_REQUEST:
      return state.set('isFetching', true);

    case ActionTypes.ISSUES_SUCCESS:
      return state.merge({
        isFetching: false,
        pageUrls: response.get('pageUrls')
      });

    case ActionTypes.ISSUES_FAILURE:
      return state.set('isFetching', false);

    case ActionTypes.ISSUES_PARAMS_UPDATE:
      return state.merge({
        owner: action.owner,
        repo: action.repo,
        page: action.page
      });

    case ActionTypes.NEXT_ISSUES_REQUEST:
      return state.set('quietFetching', true);

    case ActionTypes.NEXT_ISSUES_SUCCESS:
      return state.merge({
        quietFetching: false,
        nextPageUrls: response.get('pageUrls')
      });

    case ActionTypes.NEXT_ISSUES_FAILURE:
      return state.set('quietFetching', false);

    case ActionTypes.NEXT_ISSUES_LOAD:
      return state.set('pageUrls', state.get('nextPageUrls'));

    default:
      return state;
  }
};
