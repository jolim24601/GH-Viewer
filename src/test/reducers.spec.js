import { OrderedMap, Map } from 'immutable';
import { expect } from 'chai';

import issues from '../reducers/issues';

describe('reducers', () => {
  describe('issues', () => {
    it('handles RECEIVE_ISSUES', () => {
      const initialState = OrderedMap();
      const issue = Map({ number: 1, title: 'An issue' });
      const action = { type: 'RECEIVE_ISSUES', issues: [issue] };
      const nextState = issues(initialState, action);

      expect(nextState).to.equal(OrderedMap({ 1: issue }));
    });
  });
});
