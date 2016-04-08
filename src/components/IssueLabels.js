import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { List } from 'immutable';

// choose color of text based on contrast with background-color
function getContrastYIQ(hexcolor){
    var r = parseInt(hexcolor.substr(0,2),16);
    var g = parseInt(hexcolor.substr(2,2),16);
    var b = parseInt(hexcolor.substr(4,2),16);
    var yiq = ((r*299)+(g*587)+(b*114))/1000;
    return (yiq >= 128) ? 'black' : 'white';
}

export default class IssueLabels extends Component {
  static propTypes = {
    labels: PropTypes.instanceOf(List).isRequired
  }

  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  renderLabel(label) {
    const bgColor = label.get('color');

    return (
      <span
        key={label.get('name')}
        style={{ backgroundColor: bgColor, color: getContrastYIQ(bgColor) }}
        className="label">
        {label.get('name')}
      </span>
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
