import React from 'react';
import { Route, Redirect } from 'react-router';
import App from './containers/App';
import IssuesList from './containers/IssuesList';
import IssueDetail from './containers/IssueDetail';

export default (
  <Route component={App}>
    <Redirect from="/" to="npm/npm/issues" />
    <Redirect from="/:owner/:repo" to="/:owner/:repo/issues" />
    <Route path="/:owner/:repo/issues" component={IssuesList} />
    <Route path="/:owner/:repo/issues/:issueId" component={IssueDetail} />
  </Route>
);
