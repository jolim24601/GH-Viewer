import { combineReducers } from 'redux-immutablejs';
import issues from './issues';
import comments from './comments';
import pagination from './pagination';
import error from './error';
import router from './router';

export default combineReducers({
  issues,
  comments,
  pagination,
  error,
  router
});
