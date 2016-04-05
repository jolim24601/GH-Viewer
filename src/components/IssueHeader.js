import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import TimeAgo from './TimeAgo';
import { Map } from 'immutable';

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

    return (
      <div className="issue-header">
        <h1>
          <div>{`#${issue.get('number')}: ${issue.get('title')}`}</div>
        </h1>

        <div className="issue-meta">
          <span>
            <a href={user.get('html_url')}>
              {user.get('login')}
            </a>
            {' '}opened this issue
          </span>

          {' '}<TimeAgo datetime={issue.get('created_at')} />
        </div>
      </div>
    );
  }
}
