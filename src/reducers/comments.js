import { RESET_COMMENTS, COMMENTS_SUCCESS, USER_MENTION } from '../actions';
import { List } from 'immutable';

const initialState = List();

export default (state = initialState, action) => {
  const response = action.response;

  switch (action.type) {
    case COMMENTS_SUCCESS:
      return response.get('json');

    case RESET_COMMENTS:
      return List();

    case USER_MENTION:
      // everything but the original parent issue
      return response.slice(1);

    default:
      return state;
  }
};
