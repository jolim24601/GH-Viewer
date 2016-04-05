import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import moment from 'moment';

export default class TimeAgo extends Component {
  static propTypes = {
    datetime: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    const { datetime } = this.props;

    return (
      <time datetime={datetime} is="relative-time">
        {`${moment(datetime).fromNow()}`}
      </time>
    );
  }
}
