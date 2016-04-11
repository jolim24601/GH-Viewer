import { OrderedMap, Map, List } from 'immutable';
import { expect } from 'chai';

import * as ActionTypes from '../actions';
import issues from '../reducers/issues';
import pagination from '../reducers/pagination';
import error from '../reducers/error';
import router from '../reducers/router';
import comments from '../reducers/comments';

describe('reducers', function () {
  describe('issues', function () {
    const initialState = OrderedMap();
    const issue = Map({ number: 1, title: 'An issue', body: 'A body' });
    const nextIssue = Map({ number: 2, title: 'Another issue', body: 'Another body' });

    it('handles ISSUES_SUCCESS', function() {
      let nextState = issues(initialState, {
        type: ActionTypes.ISSUES_SUCCESS,
        response: Map({ json: [issue] })
      });

      expect(nextState).to.have.keys(["currentPageIssues"]);
      expect(nextState.get("currentPageIssues")).to.be.instanceof(OrderedMap);
    });

    it('sets next page issues as current page on NEXT_ISSUES_LOAD', function () {
      let nextState = issues(initialState, {
        type: ActionTypes.NEXT_ISSUES_SUCCESS,
        response: Map({ json: [nextIssue] })
      });
      nextState = issues(nextState, {
        type: ActionTypes.NEXT_ISSUES_LOAD
      });

      expect(nextState.getIn(['currentPageIssues', 2])).to.eq(nextIssue);
    });

    it('sets current page issues as next page issues on PREVIOUS_ISSUES_REQUEST', function () {
      let nextState = issues(initialState, {
        type: ActionTypes.ISSUES_SUCCESS,
        response: Map({ json: [issue] })
      });
      nextState = issues(nextState, {
        type: ActionTypes.PREVIOUS_ISSUES_REQUEST
      });

      expect(nextState.getIn(['nextPageIssues', 1])).to.eq(issue);
    });
  });

  describe('pagination', function() {
    const nextPageUrls = Map({
      next: 'nextLink',
      prev: 'prevLink',
      first: 'firstLink',
      last: 'lastLink'
    });
    const initialState = Map({
      nextPageUrls
    });

    it('sets nextPageUrls as pageUrls on NEXT_ISSUES_LOAD', function () {
      let nextState = pagination(initialState, {
        type: ActionTypes.NEXT_ISSUES_LOAD
      });

      expect(nextState.get("pageUrls")).to.equal(nextPageUrls);
    });
  });

  describe('error', function () {
    it('handles API errors', function () {
      let nextState = error(null, {
        type: ActionTypes.ISSUES_FAILURE,
        error: 'No issues found'
      });

      expect(nextState).to.equal('No issues found');
    });

    it('handles RESET_ERROR_MESSAGE', function () {
      let nextState = error(null, {
        type: ActionTypes.ISSUES_FAILURE,
        error: 'No issues found'
      });

      nextState = error(nextState, {
        type: ActionTypes.RESET_ERROR_MESSAGE
      });

      expect(nextState).to.be.null;
    });

    it('does not set error on USER_FAILURE', function () {
      let nextState = error(null, {
        type: ActionTypes.USER_FAILURE,
        error: 'No user found'
      });

      expect(nextState).to.be.null;
    });
  });

  describe('router', function () {
    it('wraps router state as an immutable map', function () {
      let nextState = router(undefined, {
        type: ActionTypes.LOCATION_CHANGE
      });

      expect(nextState).to.be.instanceOf(Map);
    });
  });

  describe('comments', function () {
    it('resets comments as an empty list', function () {
      let nextState = comments(undefined, {
        type: ActionTypes.COMMENTS_SUCCESS,
        response: Map({
          json: List(['comment1', 'comment2'])
        })
      });

      expect(nextState).to.have.size(2);

      nextState = comments(nextState, {
        type: ActionTypes.RESET_COMMENTS
      });

      expect(nextState).to.be.empty;
    });
  });
});
