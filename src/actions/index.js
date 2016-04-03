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

export function loadIssuesByRepo(owner, repo) {
  return (dispatch, getState) => {
    // eventually may want to check the cache here

    return dispatch(fetchIssuesByRepo(owner, repo));
  };
}

export const RESET_ERROR_MESSAGE = 'RESET_ERROR_MESSAGE';

export function resetErrorMessage() {
  return {
    type: RESET_ERROR_MESSAGE
  };
}
