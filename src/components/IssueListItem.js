import React, { Component, PropTypes } from 'react';
import { Map } from 'immutable';
import { Link } from 'react-router';

export default class IssueListItem extends Component {
  static propTypes = {
    issue: PropTypes.instanceOf(Map).isRequired
  }

  render() {
    const { issue } = this.props;

    return (
      <li>
        <Link to={`issues/${issue.get('number')}`}>
          {issue.get('title')}
        </Link>
      </li>
    );
  }
}
