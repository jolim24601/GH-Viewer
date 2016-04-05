import {
  NEXT_ISSUES_SUCCESS,
  NEXT_ISSUES_LOADED,
  ISSUES_SUCCESS,
  ISSUE_SUCCESS } from '../actions';

import { Map, OrderedMap } from 'immutable';

const initialState = Map({
  currentPageIssues: OrderedMap(),
  nextPageIssues: OrderedMap()
});

export default (state = initialState, action) => {
  switch (action.type) {
    case ISSUES_SUCCESS:
    case NEXT_ISSUES_SUCCESS:
      const issues = action.response.get('json');

      // map the issue to its index
      let om = OrderedMap().withMutations((map) => {
        issues.forEach((issue) => map.set(issue.get('number'), issue));
      });

      if (action.type === ISSUES_SUCCESS) {
        return state.set('currentPageIssues', om);
      } else {
        return state.set('nextPageIssues', om);
      }

    case NEXT_ISSUES_LOADED:
      // set next page as current from cache
      return state.merge({
        currentPageIssues: state.get('nextPageIssues'),
        nextPageIssues: om
      });

    case ISSUE_SUCCESS:
      let issue = action.response.get('json');
      return state.setIn(['currentPageIssues', issue.get('number')], issue);

    default:
      return state;
  }
};
