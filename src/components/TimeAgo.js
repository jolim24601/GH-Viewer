import React, { PropTypes } from 'react';
import moment from 'moment';

const TimeAgo = (props) => {
  return (
    <time datetime={props.datetime} is="relative-time">
      {`${moment(props.datetime).fromNow()}`}
    </time>
  );
};

TimeAgo.propTypes = {
  datetime: PropTypes.string.isRequired
};

export default TimeAgo;
