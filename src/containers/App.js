import React, { Component, PropTypes } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './App.css';

export default class App extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  render() {
    return (
      <main className="main">
        <Header />
        {this.props.children}
        <Footer />
      </main>
    );
  }
}
