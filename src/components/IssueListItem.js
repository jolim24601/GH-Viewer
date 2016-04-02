import React, { Component, PropTypes } from 'react';
import { Map } from 'immutable';
import { Link } from 'react-router';
import PureRenderMixin from 'react-addons-pure-render-mixin';

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
      <li>
        <Link to={`issues/${issue.get('number')}`}>
          {issue.get('title')}
        </Link>
      </li>
    );
  }
}
