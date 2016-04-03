import { combineReducers } from 'redux-immutablejs';
import issues from './issues';
import pagination from './pagination';
import errors from './errors';
import router from './router';

export default combineReducers({
  issues,
  pagination,
  errors,
  router
});
