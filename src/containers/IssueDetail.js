import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import { OrderedMap, List } from 'immutable';
import Comment from '../components/Comment';
import IssueHeader from '../components/IssueHeader';
import { loadCommentsByIssue, loadIssueByRepo } from '../actions';
import './IssueDetail.css';

class IssueDetail extends Component {
  static propTypes = {
    issues: PropTypes.instanceOf(OrderedMap).isRequired,
    comments: PropTypes.instanceOf(List).isRequired,
    loadIssueByRepo: PropTypes.func.isRequired,
    loadCommentsByIssue: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);

    this.state = { commentsFetched: false };
  }

  componentWillMount() {
    const { loadIssueByRepo, params } = this.props;

    // trial project set as default args, otherwise would be passed in through route params
    loadIssueByRepo(undefined, undefined, params.issueId);
  }

  componentWillReceiveProps(nextProps) {
    const { comments, loadCommentsByIssue } = nextProps;
    const issue = this.getIssueByParams(nextProps);

    if (issue && issue.get('comments') !== comments.size
        && !this.state.commentsFetched) {

      this.setState(
        { commentsFetched: true },
        loadCommentsByIssue(issue.get('comments_url'))
      );
    }
  }

  getIssueByParams(props) {
    const { issues, params } = props;

    return issues.get(parseInt(params.issueId));
  }

  render() {
    const { comments } = this.props;
    const issue = this.getIssueByParams(this.props);

    if (!issue) {
      return (
        <div style={{ textAlign: 'center' }}>
          One moment...
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
  loadIssueByRepo,
  loadCommentsByIssue
})(IssueDetail);
