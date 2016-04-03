import React from 'react';
import { Route, Redirect } from 'react-router';
import App from './containers/App';
import IssuesList from './containers/IssuesList';
import IssueDetail from './containers/IssueDetail';

export default (
  <Route component={App}>
    <Redirect from="/" to="issues" />
    <Route path="issues" component={IssuesList} />
    <Route path="issues/:issueId" component={IssueDetail} />
  </Route>
);
