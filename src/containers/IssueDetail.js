import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import { OrderedMap, List } from 'immutable';
import Comment from '../components/Comment';
import IssueHeader from '../components/IssueHeader';
import Spinner from '../components/Spinner';
import { loadIssueByRepo, resetComments } from '../actions';
import './IssueDetail.css';

class IssueDetail extends Component {
  static propTypes = {
    issues: PropTypes.instanceOf(OrderedMap).isRequired,
    comments: PropTypes.instanceOf(List).isRequired,
    loadIssueByRepo: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    const { loadIssueByRepo, loadCommentsByIssue, params } = props;
    loadIssueByRepo(params.owner, params.repo, parseInt(params.issueId));
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  componentWillUnmount() {
    this.props.resetComments();
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

  allComments(issue) {
    if (!issue) return false;
    const { comments } = this.props;
    const numComments = issue.get('comments');
    const maxComments = issue.get('comments') >= 100;
    return numComments === comments.size || maxComments;
  }

  renderSpinner() {
    const { comments } = this.props;
    const issue = this.getIssueByParams();

    if (!issue || !this.allComments(issue)) {
      return <Spinner />;
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
  loadIssueByRepo,
  resetComments
})(IssueDetail);
