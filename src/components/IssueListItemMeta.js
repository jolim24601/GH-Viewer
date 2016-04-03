import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

export default class IssueListItemMeta extends Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    user: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    const { id, user } = this.props;

    return (
      <div className="issue-meta">
        <span>
          #{id} opened by {user.get('login')}
        </span>
      </div>
    );
  }
}
