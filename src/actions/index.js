import fetch from 'isomorphic-fetch';

export const RECEIVE_ISSUES = 'RECEIVE_ISSUES';
export const RECEIVE_ISSUE = 'RECEIVE_ISSUE';
export const RECEIVE_COMMENTS = 'RECEIVE_COMMENTS';

function receiveIssues(issues) {
  return {
    type: RECEIVE_ISSUES,
    issues
  };
}

function receiveComments(comments) {
  return {
    type: RECEIVE_COMMENTS,
    comments
  };
}

export function fetchIssuesByRepo(owner, repo) {
  return (dispatch) => {
    return fetch(`https://api.github.com/repos/${owner}/${repo}/issues`)
            .then((response) => response.json())
            .then((issues) => dispatch(receiveIssues(issues)));
  };
}

export function fetchCommentsByIssue(url) {
  return (dispatch) => {
    return fetch(url)
            .then((response) => response.json())
            .then((comments) => dispatch(receiveComments(comments)));
  };
}
