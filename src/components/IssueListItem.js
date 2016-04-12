import React, { Component, PropTypes } from 'react';
import { Map } from 'immutable';
import { Link } from 'react-router';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import IssueListItemMeta from './IssueListItemMeta';
import Avatar from './Avatar';
import IssueLabels from './IssueLabels';
import Markdown from '../components/Markdown';
import { Lexer } from 'marked';

function cutString(s, n) {
  s = s.substr(0, n + 1);
  s = s.split('\n').join(' ');
  return s.substr(0, s.lastIndexOf(' '));
}

function createTeaser(text, limit) {
  let teaser = '';
  const blocks = new Lexer().lex(text);

  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].type !== 'paragraph' || teaser.length >= 140) continue;
    if (i > 0) teaser += '\n';
    teaser += blocks[i].text;
  }

  teaser = cutString(teaser, 140);
  return text.length !== teaser.length ? teaser + '...' : teaser;
}

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
              <p className="markdown-text" data-text="Nothing here.">
                {createTeaser(issue.get('body'), 140)}
              </p>
            </div>
          </Link>
        </div>

      </li>
    );
  }
}
