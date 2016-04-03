import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import { OrderedMap, List } from 'immutable';
import Comment from '../components/Comment';
import IssueHeader from '../components/IssueHeader';
import { loadCommentsByIssue } from '../actions';
import './IssueDetail.css';

class IssueDetail extends Component {
  static propTypes = {
    issues: PropTypes.instanceOf(OrderedMap).isRequired,
    comments: PropTypes.instanceOf(List).isRequired,
    loadCommentsByIssue: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  componentWillMount() {
    const { issues, loadCommentsByIssue } = this.props;
    const issue = this.getIssueByParams();
    if (!issue) { return null; }
    loadCommentsByIssue(issue.get('comments_url'));
  }

  getIssueByParams() {
    const { issues, params } = this.props;
    return issues.get(parseInt(params.issueId));
  }

  render() {
    const { comments } = this.props;
    const issue = this.getIssueByParams();

    // this could be a loader while a fetch is made for a single issue
    if (!issue) {
      return (
        <div style={{ textAlign: 'center' }}>
          Oops! Something went wrong.
        </div>
      );
    }

    return (
      <div className="issue-detail">
        <IssueHeader issue={issue} />
        <Comment comment={issue} />
        {
          comments.valueSeq().map(
            (comment) => <Comment key={comment.get('id')} comment={comment} />
          )
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    issues: state.get('issues'),
    comments: state.get('comments')
  };
};

export default connect(mapStateToProps, {
  loadCommentsByIssue
})(IssueDetail);
