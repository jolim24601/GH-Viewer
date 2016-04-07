import { CALL_API } from '../middleware/api';
import { loadCommentsWithMentions, generateUserMentions, generateParams } from './index';
import queryString from 'query-string';

const TRIAL_OWNER = 'npm';
const TRIAL_REPO = 'npm';

export const ISSUE_REQUEST = 'ISSUE_REQUEST';
export const ISSUE_SUCCESS = 'ISSUE_SUCCESS';
export const ISSUE_FAILURE = 'ISSUE_FAILURE';
export const ISSUES_REQUEST = 'ISSUES_REQUEST';
export const ISSUES_SUCCESS = 'ISSUES_SUCCESS';
export const ISSUES_FAILURE = 'ISSUES_FAILURE';
export const ISSUES_PAGE_UPDATE = 'ISSUES_PAGE_UPDATE';
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

export function loadIssuesByRepo(owner = TRIAL_OWNER, repo = TRIAL_REPO, query) {
  return (dispatch, getState) => {
    let recentPageNum = getState().getIn(['pagination', 'recentPageNum']);
    let pageNum = query.page || 1;
    recentPageNum = parseInt(recentPageNum);
    pageNum = parseInt(pageNum);

    // if user is going back cache current page issues as next page
    if (recentPageNum === pageNum) return dispatch(cacheCurrentAsNext);

    // if user is going to next page get it from cache
    if (recentPageNum === pageNum - 1) {
      dispatch(loadNextIssues);
    } else {
      dispatch(fetchIssuesByRepo(owner, repo, query)).then((_res) => {
        // fetch and cache the next page
        return dispatch(fetchIfNextPage);
      });
    }

    return dispatch({ type: ISSUES_PAGE_UPDATE, recentPageNum: pageNum });
  };
}

export function loadIssueByRepo(owner = TRIAL_OWNER, repo = TRIAL_REPO, id) {
  return (dispatch, getState) => {
    const issues = getState().get('issues');
    let issue = issues.getIn(['currentPageIssues', id]);

    if (issue) return dispatch(getUserMentionsAndComments(issue));

    // fetch from API if issue is not in cache
    return dispatch(fetchIssueByRepo(owner, repo, id)).then(({ response, type }) => {
      issue = response.get('json');
      if (issue) dispatch(getUserMentionsAndComments(issue));
    });
  };
}
