import React from 'react';
import { Link } from 'react-router';

const Header = () => {
  return (
    <header>
      <h1 className="page-header">
        <Link to="/">
          YOU'VE GOT ISSUES
        </Link>
      </h1>
    </header>
  );
};

export default Header;
