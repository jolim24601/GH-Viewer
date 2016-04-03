import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { List } from 'immutable';

export default class IssueLabels extends Component {
  static propTypes = {
    labels: PropTypes.instanceOf(List).isRequired
  }

  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  renderLabel(label) {
    let labelStyle = {
      backgroundColor: `#${label.get('color')}`,
      color: 'white'
    };

    return (
      <a
        key={label.get('name')}
        href={label.get('url')}
        style={labelStyle}
        className="label">
          {label.get('name')}
      </a>
    );
  }

  render() {
    const { labels } = this.props;

    return (
      <div className="issue-labels">
        {labels.map((label) => this.renderLabel(label))}
      </div>
    );
  }
}
