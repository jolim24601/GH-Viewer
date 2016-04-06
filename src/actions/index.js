import { CALL_API } from '../middleware/api';
import queryString from 'query-string';

const TRIAL_OWNER = 'npm';
const TRIAL_REPO = 'npm';
const GITHUB_KEY = process.env.GITHUB_KEY;

function generateParams(query) {
  query = query ? query : {};
  query.access_token = GITHUB_KEY;

  return `?${queryString.stringify(query)}`;
}

export const USER_REQUEST = 'USER_REQUEST';
export const USER_SUCCESS = 'USER_SUCCESS';
export const USER_FAILURE = 'USER_FAILURE';

export function fetchUser(username) {
  return {
    [CALL_API]: {
      types: [ USER_REQUEST, USER_SUCCESS, USER_FAILURE ],
      endpoint: `users/${username}${generateParams()}`
    }
  };
}

export const NEXT_ISSUES_REQUEST = 'NEXT_ISSUES_REQUEST';
export const NEXT_ISSUES_SUCCESS = 'NEXT_ISSUES_SUCCESS';
export const NEXT_ISSUES_FAILURE = 'NEXT_ISSUES_FAILURE';

export const NEXT_ISSUES_LOADED = 'NEXT_ISSUES_LOADED';

function fetchNextIssues(url) {
  return {
    [CALL_API]: {
      types: [ NEXT_ISSUES_REQUEST, NEXT_ISSUES_SUCCESS, NEXT_ISSUES_FAILURE ],
      endpoint: url
    }
  };
}

function cacheNextIssues(dispatch, getState) {
  const nextPageUrl = getState().getIn(['pagination', 'pageUrls', 'nextPageUrl']);
  if (nextPageUrl) {
    return dispatch(fetchNextIssues(nextPageUrl));
  }
}

// fetches the cached result
export function loadNextIssues() {
  return (dispatch, getState) => {
    const nextIssues = getState().getIn(['issues', 'nextPageIssues']);

    // update pagination and issues
    dispatch({ type: NEXT_ISSUES_LOADED });

    cacheNextIssues(dispatch, getState);
  };
}

export const ISSUES_REQUEST = 'ISSUES_REQUEST';
export const ISSUES_SUCCESS = 'ISSUES_SUCCESS';
export const ISSUES_FAILURE = 'ISSUES_FAILURE';

export const ISSUES_UPDATED = 'ISSUES_UPDATED';

function fetchIssuesByRepo(owner, repo, query) {
  return {
    [CALL_API]: {
      types: [ ISSUES_REQUEST, ISSUES_SUCCESS, ISSUES_FAILURE ],
      endpoint: `repos/${owner}/${repo}/issues${generateParams(query)}`
    }
  };
}

export function loadIssuesByRepo(owner = TRIAL_OWNER, repo = TRIAL_REPO, query) {
  return (dispatch, getState) => {
    const recentPageNum = getState().getIn(['pagination', 'recentPageNum']);
    const pageNum = query.page || '1';
    // if user is coming from issue detail get page from cache
    if (recentPageNum === pageNum) {
      dispatch({ type: ISSUES_UPDATED, recentPageNum: pageNum });
      return null;
    }

    dispatch(fetchIssuesByRepo(owner, repo, query))
            .then((_response) => {
              dispatch({ type: ISSUES_UPDATED, recentPageNum: pageNum });
              cacheNextIssues(dispatch, getState);
            });
  };
}

export const COMMENTS_REQUEST = 'COMMENTS_REQUEST';
export const COMMENTS_SUCCESS = 'COMMENTS_SUCCESS';
export const COMMENTS_FAILURE = 'COMMENTS_FAILURE';

function fetchCommentsByIssue(url) {
  return {
    [CALL_API]: {
      types: [ COMMENTS_REQUEST, COMMENTS_SUCCESS, COMMENTS_FAILURE ],
      endpoint: `${url}${generateParams()}`
    }
  };
}

export const ISSUE_REQUEST = 'ISSUE_REQUEST';
export const ISSUE_SUCCESS = 'ISSUE_SUCCESS';
export const ISSUE_FAILURE = 'ISSUE_FAILURE';

// if user refreshes the page or from outside the homepage
function fetchIssueByRepo(owner, repo, id) {
  return {
    [CALL_API]: {
      types: [ ISSUE_REQUEST, ISSUE_SUCCESS, ISSUE_FAILURE ],
      endpoint: `repos/${owner}/${repo}/issues/${id}${generateParams()}`
    }
  };
}

export function loadIssueByRepo(owner = TRIAL_OWNER, repo = TRIAL_REPO, id) {
  return (dispatch, getState) => {
    const issues = getState().get('issues');
    const issue = issues.getIn(['currentPageIssues', id]);

    if (issue) {
      return dispatch(fetchCommentsByIssue(issue.get('comments_url')));
    }

    return dispatch(fetchIssueByRepo(owner, repo, id))
      .then(({ response, type }) => {
        if (type === ISSUE_SUCCESS) {
          const issue = response.get('json');
          return dispatch(fetchCommentsByIssue(issue.get('comments_url')));
        }
      });
  };
}

export const RESET_ERROR_MESSAGE = 'RESET_ERROR_MESSAGE';

export function resetErrorMessage() {
  return {
    type: RESET_ERROR_MESSAGE
  };
}
