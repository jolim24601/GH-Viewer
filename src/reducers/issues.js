import { ISSUES_SUCCESS } from '../actions';
import { OrderedMap } from 'immutable';

const initialState = OrderedMap();

export default (state = initialState, action) => {

  if (action.type === ISSUES_SUCCESS) {
    const response = action.response;

    let issues = response.get('json');

    return issues.reduce((result, issue) => {
      return result.set(issue.get('number'), issue);
    }, OrderedMap());
  }

  return state;
};
