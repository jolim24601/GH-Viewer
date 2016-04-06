import { COMMENTS_SUCCESS, USER_MENTION } from '../actions';
import { List } from 'immutable';

const initialState = List();

export default (state = initialState, action) => {
  const response = action.response;

  if (action.type === COMMENTS_SUCCESS) {
    return response.get('json');
  }

  if (action.type === USER_MENTION) {
    return state.map((comment) =>
      comment.get('id') === response.get('id') ? response : comment
    );
  }

  return state;
};
