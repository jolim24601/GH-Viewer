import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class Header extends Component {
  render() {
    return (
      <header>
        <h1 className="page-header">
          <Link to="/">
            YOU'VE GOT ISSUES
          </Link>
        </h1>
      </header>
    );
  }
}
