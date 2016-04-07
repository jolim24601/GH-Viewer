import * as ActionTypes from '../actions';
import { Map, OrderedMap } from 'immutable';

const initialState = Map({
  currentPageIssues: OrderedMap(),
  nextPageIssues: OrderedMap()
});

function replaceNullBodies(issues) {
  return issues.map((issue) => {
    return issue.set('body', issue.get('body') || '');
  });
}

function mapIssuesToIndex(issues) {
  return OrderedMap().withMutations((map) => {
    issues.forEach((issue) => map.set(issue.get('number'), issue));
  });
}

export default (state = initialState, action) => {
  const response = action.response;
  let issue, issues, issuesByIndex;

  switch (action.type) {
    case ActionTypes.ISSUES_SUCCESS:
      issues = replaceNullBodies(response.get('json'));
      issuesByIndex = mapIssuesToIndex(issues);
      return state.set('currentPageIssues', issuesByIndex);

    case ActionTypes.NEXT_ISSUES_SUCCESS:
      issues = response.get('json');
      issuesByIndex = mapIssuesToIndex(issues);
      return state.set('nextPageIssues', issuesByIndex);

    case ActionTypes.NEXT_ISSUES_LOAD:
      // set next page as current from cache
      return state.merge({
        currentPageIssues: state.get('nextPageIssues'),
        nextPageIssues: issuesByIndex
      });

    case ActionTypes.PREVIOUS_ISSUES_REQUEST:
      // keep next page results as the current page
      return state.set('nextPageIssues', state.get('currentPageIssues'));

    case ActionTypes.ISSUE_SUCCESS:
      issue = replaceNullBodies([response.get('json')])[0];
      return state.setIn(['currentPageIssues', issue.get('number')], issue);

    case ActionTypes.USER_MENTION:
      // if not a comment update issue body with mentions
      if (response.get('number')) {
        return state.setIn(['currentPageIssues', response.get('number')], response);
      }

      return state;
    default:
      return state;
  }
};
