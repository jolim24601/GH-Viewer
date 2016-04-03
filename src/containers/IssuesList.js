import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import { fetchIssuesByRepo } from '../actions';
import IssueListItem from '../components/IssueListItem';
import { List } from 'immutable';
import './IssuesList.css';

class IssuesList extends Component {
  static propTypes = {
    issues: PropTypes.instanceOf(List).isRequired,
    children: PropTypes.node,
    dispatch: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchIssuesByRepo('npm', 'npm'));
  }

  render() {
    const { issues, children } = this.props;

    return (
      <div className="list-container">
        <ul className="issues-list">
          {
            children ? children :
            issues.toArray().map((issue) =>
              <IssueListItem issue={issue} key={issue.get('id')} />
            )
          }
        </ul>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    issues: state.get('issues')
  };
}

export default connect(mapStateToProps)(IssuesList);
