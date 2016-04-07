import React, { Component, PropTypes } from 'react';
import { Map } from 'immutable';
import { Link } from 'react-router';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import IssueListItemMeta from './IssueListItemMeta';
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

    // const cleanEndings = ['\w+', '\n'];
    // let skip = 0, teaser, lastClean;
    // while (skip <= 140) {
    //   if (cutoff.match(body[i])) {
    //     lastClean = i;
    //   }
    // }

    body.length > 140 ? teaser += '...' : null;
    return <Markdown body={teaser} noLinks />;
  }

  render() {
    const { issue, owner, repo } = this.props;
    const user = issue.get('user');

    return (
      <li className="issue-list-item group">

        <a className="avatar-link" href={user.get('html_url')}>
          <img className="avatar-image" src={user.get('avatar_url')}></img>
        </a>

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
