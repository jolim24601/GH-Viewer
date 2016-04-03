import { COMMENTS_SUCCESS } from '../actions';
import { List } from 'immutable';

const initialState = List();

export default (state = initialState, action) => {

  if (action.type === COMMENTS_SUCCESS) {
    const response = action.response;
    return response.get('json');
  }

  return state;
};
