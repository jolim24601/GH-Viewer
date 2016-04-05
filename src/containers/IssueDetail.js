import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import { OrderedMap, List } from 'immutable';
import Comment from '../components/Comment';
import IssueHeader from '../components/IssueHeader';
import { loadIssueByRepo } from '../actions';
import './IssueDetail.css';

class IssueDetail extends Component {
  static propTypes = {
    issues: PropTypes.instanceOf(OrderedMap).isRequired,
    comments: PropTypes.instanceOf(List).isRequired,
    loadIssueByRepo: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  componentWillMount() {
    const { loadIssueByRepo, loadCommentsByIssue, params } = this.props;

    // trial project set as default args, otherwise would be passed in through route params
    loadIssueByRepo(undefined, undefined, parseInt(params.issueId));
  }

  getIssueByParams() {
    const { issues, params } = this.props;
    return issues.get(parseInt(params.issueId));
  }

  renderIssueHeader() {
    const issue = this.getIssueByParams();

    if (issue) {
      return (
        <div className="op-issue">
          <IssueHeader issue={issue} />
          <Comment comment={issue} />
        </div>
      );
    }
  }

  renderSpinner() {
    const { comments } = this.props;
    const issue = this.getIssueByParams();

    if (!issue || issue.get('comments') !== comments.size) {
      return (
        <div className="ellipsis">
        </div>
      );
    }
  }

  render() {
    const { comments } = this.props;

    return (
      <div className="issue-detail">
        {this.renderIssueHeader()}
        {
          comments.valueSeq().map(
            (comment) => <Comment key={comment.get('id')} comment={comment} />
          )
        }
        {this.renderSpinner()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    issues: state.getIn(['issues', 'currentPageIssues']),
    comments: state.get('comments')
  };
};

export default connect(mapStateToProps, {
  loadIssueByRepo
})(IssueDetail);
