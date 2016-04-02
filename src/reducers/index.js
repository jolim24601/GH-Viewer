import { combineReducers } from 'redux-immutablejs';
import issues from './issues';
import router from './router';

export default combineReducers({
  issues,
  router
});
