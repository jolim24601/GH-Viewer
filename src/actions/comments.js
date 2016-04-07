import { CALL_API } from '../middleware/api';
import { generateUserMentions, generateParams } from './index';

export const COMMENTS_REQUEST = 'COMMENTS_REQUEST';
export const COMMENTS_SUCCESS = 'COMMENTS_SUCCESS';
export const COMMENTS_FAILURE = 'COMMENTS_FAILURE';
export const RESET_COMMENTS = 'RESET_COMMENTS';

function fetchCommentsByIssue(url) {
  return {
    [CALL_API]: {
      types: [ COMMENTS_REQUEST, COMMENTS_SUCCESS, COMMENTS_FAILURE ],
      endpoint: `${url}${generateParams()}`
    }
  };
}

export function resetComments() {
  return {
    type: RESET_COMMENTS
  };
}

export function loadCommentsWithMentions(url) {
  return (dispatch, getState) => {
    return dispatch(fetchCommentsByIssue(url)).then((action) => {
      const comments = action.response.get('json');
      return comments ? dispatch(generateUserMentions(comments)) : null;
    });
  };
}
