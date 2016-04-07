import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import TimeAgo from './TimeAgo';

export default class IssueListItemMeta extends Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    user: PropTypes.object.isRequired,
    datetime: PropTypes.string.isRequired,
    comments: PropTypes.number.isRequired
  }

  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    const { id, user, datetime, comments } = this.props;

    return (
      <div className="issue-meta">
        <span>
          #{id} opened by
          <a href={user.get('html_url')}>
            {' '}{user.get('login')}
          </a>
          {' '}<TimeAgo datetime={datetime} />{' '}
          &middot;{` ${comments} `} comments
        </span>
      </div>
    );
  }
}
