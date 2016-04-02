import { RECEIVE_ISSUES } from '../actions';
import { List } from 'immutable';

const initialState = List();

export default (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_ISSUES:
      return state.merge(action.issues);
    default:
      return state;
  }
};
