import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import { resetErrorMessage } from '../actions';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './App.css';

class App extends Component {
  static propTypes = {
    children: PropTypes.node,
    errorMessage: PropTypes.string,
    resetErrorMessage: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  handleDismissClick(e) {
    this.props.resetErrorMessage();
    e.preventDefault();
  }

  renderErrorMessage() {
    const { errorMessage } = this.props;
    if (!errorMessage) {
      return null;
    }

    return (
      <p style={{ backgroundColor: '#e99', padding: 10 }}>
        <b>{errorMessage}</b>
        {' '}
        (<a href="#"
            onClick={this.handleDismissClick}>
          Dismiss
        </a>)
      </p>
    );
  }

  render() {
    return (
      <main className="main">
        <Header />
        {this.renderErrorMessage()}
        {this.props.children}
        <Footer />
      </main>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    errorMessage: state.get('errorMessage')
  };
}

export default connect(mapStateToProps, {
  resetErrorMessage
})(App);
