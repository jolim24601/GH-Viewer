import React, { Component, PropTypes } from 'react';

export default class Avatar extends Component {
  static propTypes = {
    userUrl: PropTypes.string.isRequired,
    avatarUrl: PropTypes.string.isRequired
  }

  render() {
    const { userUrl, avatarUrl } = this.props;
    const resizedAvatarUrl = `${avatarUrl}&s=80`;

    return (
      <div className="avatar-placeholder">
        <a className="avatar-link" href={userUrl}>
          <img src={resizedAvatarUrl} className="avatar-image fadein" />
        </a>
      </div>
    );
  }
}
