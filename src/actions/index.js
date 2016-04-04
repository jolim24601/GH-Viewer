import { CALL_API } from '../middleware/api';

const TRIAL_OWNER = 'npm';
const TRIAL_REPO = 'npm';

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

// could potentially cache results and check here if already prev. loaded
export function loadIssuesByRepo(owner = TRIAL_OWNER, repo = TRIAL_REPO) {
  return (dispatch, _getState) => dispatch(fetchIssuesByRepo(owner, repo));
}


export const ISSUE_REQUEST = 'ISSUE_REQUEST';
export const ISSUE_SUCCESS = 'ISSUE_SUCCESS';
export const ISSUE_FAILURE = 'ISSUE_FAILURE';

// if user refreshes the page or comes from another place
function fetchIssueByRepo(owner, repo, id) {
  return {
    [CALL_API]: {
      types: [ ISSUE_REQUEST, ISSUE_SUCCESS, ISSUE_FAILURE ],
      endpoint: `repos/${owner}/${repo}/issues/${id}`
    }
  };
}

export function loadIssueByRepo(owner = TRIAL_OWNER, repo = TRIAL_REPO, id) {
  return (dispatch, getState) => {
    const issues = getState().get('issues');
    const issue = issues.get(id);

    if (issue) {
      return null;
    }

    return dispatch(fetchIssueByRepo(owner, repo, id));
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

export function loadCommentsByIssue(url) {
  return (dispatch, _getState) => dispatch(fetchCommentsByIssue(url));
}

export const RESET_ERROR_MESSAGE = 'RESET_ERROR_MESSAGE';

export function resetErrorMessage() {
  return {
    type: RESET_ERROR_MESSAGE
  };
}
