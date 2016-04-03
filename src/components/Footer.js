import React, { Component, PropTypes } from 'react';

export default class Footer extends Component {
  render() {
    return (
      <footer>
        <ul className="footer-list group">
          <li>© 2016 John Lim</li>
          <li><a href="https://github.com/jolim24601">Github</a></li>
          <li><a href="https://www.linkedin.com/in/jlim5">LinkedIn</a></li>
          <li><a href="http://johnlim.me">Portfolio</a></li>
        </ul>
      </footer>
    );
  }
}
