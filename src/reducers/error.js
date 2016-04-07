import { RESET_ERROR_MESSAGE, USER_FAILURE } from '../actions';

export default (state = null, action) => {
  const { type, error } = action;

  if (type === RESET_ERROR_MESSAGE) {
    return null;
  } else if (error && type !== USER_FAILURE) {
    return action.error;
  }

  return state;
};
