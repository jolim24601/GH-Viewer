import React, { Component, PropTypes } from 'react';
import { Map } from 'immutable';
import { Link } from 'react-router';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import IssueListItemMeta from './IssueListItemMeta';
import Avatar from './Avatar';
import IssueLabels from './IssueLabels';
import Markdown from '../components/Markdown';
import marked from 'marked';

export default class IssueListItem extends Component {
  static propTypes = {
    issue: PropTypes.instanceOf(Map).isRequired,
    owner: PropTypes.string.isRequired,
    repo: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  renderIssueBody(body) {
    let teaser = body.slice(0, 140);
    let lastClean = teaser.length;
    for (let i=teaser.length; i >=0; i--) {
      if (teaser[i] === ' ') {
        lastClean = i;
        break;
      }
    }
    teaser = teaser.slice(0, lastClean);
    body.length > 140 ? teaser += '...' : null;
    return <Markdown body={teaser} noLinks />;
  }

  render() {
    const { issue, owner, repo } = this.props;
    const user = issue.get('user');

    return (
      <li className="issue-list-item group">

        <Avatar userUrl={user.get('html_url')} avatarUrl={user.get('avatar_url')} />

        <div className="item-container">
          <div className="issue-title group">
            <Link
              className="title-link"
              to={`/${owner}/${repo}/issues/${issue.get('number')}`}>
              {issue.get('title')}
            </Link>
            <IssueLabels labels={issue.get('labels')} />
          </div>

          <IssueListItemMeta
            id={issue.get('number')}
            datetime={issue.get('created_at')}
            comments={issue.get('comments')}
            user={user} />

          <Link
            className="description-link"
            to={`/${owner}/${repo}/issues/${issue.get('number')}`}>
            <div className="issue-preview">
              {this.renderIssueBody(issue.get('body'))}
            </div>
          </Link>
        </div>

      </li>
    );
  }
}
