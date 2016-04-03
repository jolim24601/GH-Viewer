import { CALL_API } from '../middleware/api';

export const ISSUES_REQUEST = 'ISSUES_REQUEST';
export const ISSUES_SUCCESS = 'ISSUES_SUCCESS';
export const ISSUES_FAILURE = 'ISSUES_FAILURE';

function fetchIssuesByRepo(owner, repo) {
  return {
    [CALL_API]: {
      types: [ ISSUES_REQUEST, ISSUES_SUCCESS, ISSUES_FAILURE ],
      endpoint: `repos/${owner}/${repo}/issues`
    }
  };
}

export const COMMENTS_REQUEST = 'COMMENTS_REQUEST';
export const COMMENTS_SUCCESS = 'COMMENTS_SUCCESS';
export const COMMENTS_FAILURE = 'COMMENTS_FAILURE';

function fetchCommentsByIssue(url) {
  return {
    [CALL_API]: {
      types: [ COMMENTS_REQUEST, COMMENTS_SUCCESS, COMMENTS_FAILURE ],
      endpoint: url
    }
  };
}

// could potentially cache results and check here if already prev. loaded
export function loadIssuesByRepo(owner, repo) {
  return (dispatch) => dispatch(fetchIssuesByRepo(owner, repo));
}

export function loadCommentsByIssue(url) {
  return (dispatch) => dispatch(fetchCommentsByIssue(url));
}

export const RESET_ERROR_MESSAGE = 'RESET_ERROR_MESSAGE';

export function resetErrorMessage() {
  return {
    type: RESET_ERROR_MESSAGE
  };
}
