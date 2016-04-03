import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import { List } from 'immutable';
import Markdown from '../components/Markdown';
import './IssueDetail.css';

class IssueDetail extends Component {
  static propTypes = {
    issues: PropTypes.instanceOf(List).isRequired
  }

  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    const { issues, params } = this.props;

    if (issues.isEmpty()) {
      return (
        <div>One moment...</div>
      );
    }

    const issue = issues.find((item) =>
      item.get('number') === parseInt(params.issueId));

    return (
      <div>
        <h1>{issue.get('title')}</h1>
        <Markdown body={issue.get('body')} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    issues: state.get('issues')
  };
};

export default connect(mapStateToProps)(IssueDetail);
