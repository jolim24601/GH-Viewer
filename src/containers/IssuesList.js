import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import { loadIssuesByRepo } from '../actions';
import IssueListItem from '../components/IssueListItem';
import PaginationList from '../components/PaginationList';
import { OrderedMap, Map } from 'immutable';
import './IssuesList.css';

class IssuesList extends Component {
  static propTypes = {
    issues: PropTypes.instanceOf(OrderedMap).isRequired,
    loadIssuesByRepo: PropTypes.func.isRequired,
    pageUrls: PropTypes.instanceOf(Map).isRequired,
  }

  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  componentWillMount() {
    const { loadIssuesByRepo } = this.props;

    // trial project set as default args, otherwise would be passed in through route params
    loadIssuesByRepo(undefined, undefined);
  }

  render() {
    const {
      issues,
      children,
      pageUrls
     } = this.props;

    return (
      <div className="list-container">
        <ul className="issues-list">
          {
            issues.valueSeq().map((issue) =>
              <IssueListItem issue={issue} key={issue.get('number')} />
            )
          }
        </ul>

        <div className="pagination">
          <PaginationList pageUrls={pageUrls} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const pagination = state.get('pagination');
  const issues = state.get('issues');

  const pageUrls = pagination.get('pageUrls');

  return {
    pageUrls,
    issues
  };
}

export default connect(mapStateToProps, { loadIssuesByRepo })(IssuesList);
