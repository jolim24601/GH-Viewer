import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import { loadIssuesByRepo, loadNextIssues } from '../actions';
import IssueListItem from '../components/IssueListItem';
import PaginationList from '../components/PaginationList';
import queryString from 'query-string';
import { OrderedMap, Map } from 'immutable';
import './IssuesList.css';

class IssuesList extends Component {
  static propTypes = {
    issues: PropTypes.instanceOf(OrderedMap).isRequired,
    loadIssuesByRepo: PropTypes.func.isRequired,
    loadNextIssues: PropTypes.func.isRequired,
    pageUrls: PropTypes.instanceOf(Map).isRequired
  }

  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  componentWillMount() {
    const { loadIssuesByRepo, location } = this.props;
    // trial project set as default args, otherwise would be passed in through route params
    loadIssuesByRepo(undefined, undefined, location.query);
  }

  componentWillReceiveProps(nextProps) {
    // should be doing this on router update, but more coherent to have code within the component
    const { location, loadNextIssues, loadIssuesByRepo } = this.props;

    const oldPage = parseInt(location.query.page);
    const nextLocation = nextProps.location;
    const newPage = parseInt(nextLocation.query.page);

    if (newPage === oldPage + 1) {
      loadNextIssues();
    } else if (oldPage !== newPage) {
      loadIssuesByRepo(undefined, undefined, nextLocation.query);
    }
  }

  getLastPageNum() {
    const { pageUrls, location } = this.props;
    const url = pageUrls.get('lastPageUrl');

    if (!url) {
      // must be on last page or there is only one page
      return parseInt(location.query.page) || 0;
    }

    const query = queryString.extract(url);
    const page = queryString.parse(query).page;
    return parseInt(page);
  }

  render() {
    const {
      issues,
      children,
      pageUrls,
      location
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
          <PaginationList
            currentPage={location.query.page ? parseInt(location.query.page) : 1}
            lastPage={this.getLastPageNum()}
            />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const pageUrls = state.getIn(['pagination', 'pageUrls']);
  const issues = state.getIn(['issues', 'currentPageIssues']);

  return { pageUrls, issues };
}

export default connect(mapStateToProps, {
  loadIssuesByRepo,
  loadNextIssues
})(IssuesList);
