import { List, fromJS } from 'immutable';
import { expect } from 'chai';

import issues from '../reducers/issues';

describe('reducers', () => {
  describe('issues', () => {
    it('handles RECEIVE_ISSUES', () => {
      const initialState = List();
      const action = { type: 'RECEIVE_ISSUES', issues: ['IssueOne'] };
      const nextState = issues(initialState, action);

      expect(nextState).to.equal(fromJS(['IssueOne']));
    });
  });
});
