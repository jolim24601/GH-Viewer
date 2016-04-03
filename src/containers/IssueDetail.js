import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import { OrderedMap } from 'immutable';
import Markdown from '../components/Markdown';
import './IssueDetail.css';

class IssueDetail extends Component {
  static propTypes = {
    issues: PropTypes.instanceOf(OrderedMap).isRequired
  }

  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    const { issues, params } = this.props;
    const issue = issues.get(parseInt(params.issueId));

    if (!issue) {
      return (
        <div style={{ textAlign: 'center' }}>
          Oops! Something went wrong.
        </div>
      );
    }

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
