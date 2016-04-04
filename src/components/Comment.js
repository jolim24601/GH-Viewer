import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { Map } from 'immutable';
import moment from 'moment';
import Markdown from './Markdown';

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
    const timeAgo = ` ${moment(comment.get('created_at')).fromNow()}`;

    return (
      <div className="issue-comment group">

        <a className="avatar-link" href={user.get('html_url')}>
          <img className="avatar-image" src={user.get('avatar_url')}></img>
        </a>

        <div className="comment-container">
          <div className="comment-meta">
            {user.get('login')} commented
            <time datetime={comment.get('created_at')} is="relative-time">
              {timeAgo}
            </time>
          </div>

          <div className="comment-body">
            <Markdown body={comment.get('body')} />
          </div>
        </div>
      </div>
    );
  }
}
