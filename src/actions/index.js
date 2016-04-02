import fetch from 'isomorphic-fetch';

export const RECEIVE_ISSUES = 'RECEIVE_ISSUES';
export const RECEIVE_ISSUE = 'RECEIVE_ISSUE';

function receiveIssues(issues) {
  return {
    type: RECEIVE_ISSUES,
    issues
  };
}

export function fetchIssuesByRepo(owner, repo) {
  return (dispatch) => {
    return fetch(`https://api.github.com/repos/${owner}/${repo}/issues`)
            .then((response) => response.json())
            .then((issues) => dispatch(receiveIssues(issues)));
  };
}
