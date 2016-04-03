import { combineReducers } from 'redux-immutablejs';
import issues from './issues';
import comments from './comments';
import pagination from './pagination';
import errors from './errors';
import router from './router';

export default combineReducers({
  issues,
  comments,
  pagination,
  errors,
  router
});
