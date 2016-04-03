import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { Map } from 'immutable';
import moment from 'moment';

export default class IssueHeader extends Component {
  static propTypes = {
    issue: PropTypes.instanceOf(Map).isRequired
  }

  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    const { issue } = this.props;
    const user = issue.get('user');
    const timeAgo = ` ${moment(issue.get('created_at')).fromNow()}`;

    return (
      <div className="issue-header">
        <h1>
          <span>{issue.get('title')}</span>
          <span>{` #${issue.get('number')}`}</span>
        </h1>

        <div className="issue-meta">
          {user.get('login')} opened this issue
          <time datetime={issue.get('created_at')} is="relative-time">
            {timeAgo}
          </time>
        </div>
      </div>
    );
  }
}
