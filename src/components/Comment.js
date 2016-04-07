import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { Map } from 'immutable';
import moment from 'moment';
import Markdown from './Markdown';
import Avatar from './Avatar';
import TimeAgo from './TimeAgo';

export default class Comment extends Component {
  static propTypes = {
    comment: PropTypes.instanceOf(Map).isRequired
  }

  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    const { comment } = this.props;
    const user = comment.get('user');

    return (
      <div className="issue-comment group">
        <Avatar userUrl={user.get('html_url')} avatarUrl={user.get('avatar_url')} />

        <div className="comment-container">
          <div className="comment-meta">
            <span>
              <a href={user.get('html_url')}>
                {user.get('login')}
              </a>
              {' '}commented
            </span>

            {' '}<TimeAgo datetime={comment.get('created_at')} />
          </div>

          <div className="comment-body">
            <Markdown body={comment.get('body')} />
          </div>
        </div>
      </div>
    );
  }
}
