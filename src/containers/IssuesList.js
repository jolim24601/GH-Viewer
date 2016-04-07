import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import { loadIssuesByRepo } from '../actions';
import IssueListItem from '../components/IssueListItem';
import PaginationList from '../components/PaginationList';
import queryString from 'query-string';
import { OrderedMap, Map } from 'immutable';
import './IssuesList.css';

class IssuesList extends Component {
  static propTypes = {
    issues: PropTypes.instanceOf(OrderedMap).isRequired,
    loadIssuesByRepo: PropTypes.func.isRequired,
    pageUrls: PropTypes.instanceOf(Map).isRequired,
    recentPageNum: PropTypes.number.isRequired,
    params: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  componentWillMount() {
    const { params, recentPageNum, loadIssuesByRepo, location } = this.props;
    const pageNum = parseInt(location.query.page);

    // if coming from somewhere else in the app use the most recently loaded page
    if (recentPageNum !== pageNum) {
      loadIssuesByRepo(params.owner, params.repo, location.query);
    }
  }

  componentWillReceiveProps(nextProps) {
    // should be doing this on router update, but more coherent to have code within the component
    const { location, loadIssuesByRepo, params } = this.props;
    const nextLocation = nextProps.location;
    const nextParams = nextProps.params;

    const oldPage = parseInt(location.query.page) || 1;
    const newPage = parseInt(nextLocation.query.page) || 1;

    const diffRepo = (params.owner !== nextParams.owner || params.repo !== nextParams.repo);

    if (oldPage !== newPage || diffRepo) {
      loadIssuesByRepo(nextParams.owner, nextParams.repo, nextLocation.query);
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
      location,
      params
     } = this.props;

    return (
      <div className="list-container">
        <ul className="issues-list">
          {
            issues.valueSeq().map((issue) =>
              <IssueListItem
                {...params}
                issue={issue}
                key={issue.get('number')} />
            )
          }
        </ul>

        <div className="pagination">
          <PaginationList
            {...params}
            currentPage={location.query.page ? parseInt(location.query.page) : 1}
            lastPage={this.getLastPageNum()} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const pageUrls = state.getIn(['pagination', 'pageUrls']);
  const recentPageNum = state.getIn(['pagination', 'recentPageNum']);
  const issues = state.getIn(['issues', 'currentPageIssues']);

  return { pageUrls, issues, recentPageNum };
}

export default connect(mapStateToProps, {
  loadIssuesByRepo
})(IssuesList);
