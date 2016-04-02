import React, { Component, PropTypes } from 'react';

export default class App extends Component {
  static propTypes = {
    children: PropTypes.node
  }
  
  render() {
    return (
      <main>
        <h1>YOU'VE GOT ISSUES</h1>
        {this.props.children}
      </main>
    );
  }
}
