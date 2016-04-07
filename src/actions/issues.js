import { CALL_API } from '../middleware/api';
import { loadCommentsWithMentions, generateUserMentions, generateParams } from './index';
import queryString from 'query-string';

export const ISSUE_REQUEST = 'ISSUE_REQUEST';
export const ISSUE_SUCCESS = 'ISSUE_SUCCESS';
export const ISSUE_FAILURE = 'ISSUE_FAILURE';
export const ISSUES_REQUEST = 'ISSUES_REQUEST';
export const ISSUES_SUCCESS = 'ISSUES_SUCCESS';
export const ISSUES_FAILURE = 'ISSUES_FAILURE';
export const ISSUES_PARAMS_UPDATE = 'ISSUES_PARAMS_UPDATE';
export const NEXT_ISSUES_REQUEST = 'NEXT_ISSUES_REQUEST';
export const NEXT_ISSUES_SUCCESS = 'NEXT_ISSUES_SUCCESS';
export const NEXT_ISSUES_FAILURE = 'NEXT_ISSUES_FAILURE';
export const NEXT_ISSUES_LOAD = 'NEXT_ISSUES_LOAD';
export const PREVIOUS_ISSUES_REQUEST = 'PREVIOUS_ISSUES_REQUEST';

function fetchNextIssues(url) {
  return {
    [CALL_API]: {
      types: [ NEXT_ISSUES_REQUEST, NEXT_ISSUES_SUCCESS, NEXT_ISSUES_FAILURE ],
      endpoint: url
    }
  };
}

function fetchIssuesByRepo(owner, repo, query) {
  return {
    [CALL_API]: {
      types: [ ISSUES_REQUEST, ISSUES_SUCCESS, ISSUES_FAILURE ],
      endpoint: `repos/${owner}/${repo}/issues${generateParams(query)}`
    }
  };
}

function fetchIssueByRepo(owner, repo, id) {
  return {
    [CALL_API]: {
      types: [ ISSUE_REQUEST, ISSUE_SUCCESS, ISSUE_FAILURE ],
      endpoint: `repos/${owner}/${repo}/issues/${id}${generateParams()}`
    }
  };
}

function fetchIfNextPage(dispatch, getState) {
  const nextPageUrl = getState().getIn(['pagination', 'pageUrls', 'nextPageUrl']);
  return nextPageUrl ?  dispatch(fetchNextIssues(nextPageUrl)) : null;
}

function loadNextIssues(dispatch, getState) {
  const nextIssues = getState().getIn(['issues', 'nextPageIssues']);
  dispatch({ type: NEXT_ISSUES_LOAD });
  return dispatch(fetchIfNextPage);
}

function cacheCurrentAsNext(dispatch, _getState) {
  dispatch({ type: PREVIOUS_ISSUES_REQUEST });
}

function getUserMentionsAndComments(issue) {
  return (dispatch, getState) => {
    dispatch(generateUserMentions(issue));
    return dispatch(loadCommentsWithMentions(issue.get('comments_url')));
  };
}

export function loadIssuesByRepo(owner, repo, query) {
  return (dispatch, getState) => {
    query.page = query.page ? query.page : 1;
    const page = parseInt(query.page);
    let lastPage = getState().getIn(['pagination', 'page']);
    lastPage = parseInt(lastPage);
    const lastOwner = getState().getIn(['pagination', 'owner']);
    const lastRepo = getState().getIn(['pagination', 'repo']);
    const sameRepo = (owner === lastOwner || repo === lastRepo);

    // issues are in cache
    if (lastPage === page && sameRepo) return null;
    // if user is going to prev page cache current page issues as next page
    if (lastPage === page + 1 && sameRepo) dispatch(cacheCurrentAsNext);
    // if user is going to next page get it from cache
    if (lastPage === page - 1 && sameRepo) {
      dispatch(loadNextIssues);
    } else {
      dispatch(fetchIssuesByRepo(owner, repo, query)).then((_action) => {
        // fetch and cache the next page
        if (lastPage !== page + 1 || !sameRepo) dispatch(fetchIfNextPage);
      });
    }

    return dispatch({ type: ISSUES_PARAMS_UPDATE, owner, repo, page });
  };
}

export function loadIssueByRepo(owner = TRIAL_OWNER, repo = TRIAL_REPO, id) {
  return (dispatch, getState) => {
    const issues = getState().get('issues');
    let issue = issues.getIn(['currentPageIssues', id]);

    if (issue) return dispatch(getUserMentionsAndComments(issue));

    // fetch from API if issue is not in cache
    return dispatch(fetchIssueByRepo(owner, repo, id)).then((action) => {
      issue = action.response.get('json');
      if (issue) dispatch(getUserMentionsAndComments(issue));
    });
  };
}
