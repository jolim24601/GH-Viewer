import React, { PropTypes } from 'react';
import { Link } from 'react-router';

const Header = (props) => {
  return (
    <header>
      <h1 className="page-header">
        <Link to="/">
          you've got issues: {`${props.owner}/${props.repo}`}
        </Link>
      </h1>
    </header>
  );
};

Header.propTypes = {
  owner: PropTypes.string.isRequired,
  repo: PropTypes.string.isRequired
};

export default Header;
