import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import { loadIssuesByRepo } from '../actions';
import IssueListItem from '../components/IssueListItem';
import { OrderedMap } from 'immutable';
import './IssuesList.css';

// trial project, which otherwise would be passed in through route params
const TRIAL_OWNER = 'npm';
const TRIAL_REPO = 'npm';

class IssuesList extends Component {
  static propTypes = {
    issues: PropTypes.instanceOf(OrderedMap).isRequired,
    loadIssuesByRepo: PropTypes.func.isRequired,
    nextPageUrl: PropTypes.string.isRequired,
    lastPageUrl: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  componentWillMount() {
    const { loadIssuesByRepo } = this.props;
    loadIssuesByRepo(TRIAL_OWNER, TRIAL_REPO);
  }

  componentWillReceiveProps(nextProps) {

  }

  render() {
    const { issues, children } = this.props;

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
          <ul className="pagination-list">
            {}
          </ul>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const pagination = state.get('pagination');
  const issues = state.get('issues');

  const nextPageUrl = pagination.get('nextPageUrl');
  const lastPageUrl = pagination.get('lastPageUrl');

  return {
    nextPageUrl,
    lastPageUrl,
    issues
  };
}

export default connect(mapStateToProps, { loadIssuesByRepo })(IssuesList);
