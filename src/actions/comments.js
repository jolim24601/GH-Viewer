import { CALL_API } from '../middleware/api';
import { generateUserMentions, generateParams } from './index';

export const COMMENTS_REQUEST = 'COMMENTS_REQUEST';
export const COMMENTS_SUCCESS = 'COMMENTS_SUCCESS';
export const COMMENTS_FAILURE = 'COMMENTS_FAILURE';
export const RESET_COMMENTS = 'RESET_COMMENTS';

function fetchCommentsByIssue(url, query) {
  return {
    [CALL_API]: {
      types: [ COMMENTS_REQUEST, COMMENTS_SUCCESS, COMMENTS_FAILURE ],
      endpoint: `${url}${generateParams(query)}`
    }
  };
}

export function resetComments() {
  return {
    type: RESET_COMMENTS
  };
}

export function loadCommentsWithMentions(issue) {
  return (dispatch, getState) => {
    return dispatch(fetchCommentsByIssue(issue.get('comments_url'), { per_page: 100 }))
      .then(({ _type, response }) => {
        const comments = response.get('json');
        // combine the issue with its comments so it can be done in one sweep
        return comments ? dispatch(generateUserMentions(comments.unshift(issue))) : null;
      });
  };
}
