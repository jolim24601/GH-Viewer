import React, { Component, PropTypes } from 'react';
import { Map } from 'immutable';
import { Link } from 'react-router';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import IssueListItemMeta from './IssueListItemMeta';
import IssueLabels from './IssueLabels';
import './IssueListItem.css';

export default class IssueListItem extends Component {
  static propTypes = {
    issue: PropTypes.instanceOf(Map).isRequired
  }

  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    const { issue } = this.props;

    return (
      <li className="issue-list-item">
        <div className="issue-title group">
          <Link className="title-link" to={`issues/${issue.get('number')}`}>
            {issue.get('title')}
          </Link>
          <IssueLabels labels={issue.get('labels')} />
        </div>
        <IssueListItemMeta id={issue.get('number')} user={issue.get('user')} />
      </li>
    );
  }
}
