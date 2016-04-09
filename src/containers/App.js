import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import { resetErrorMessage } from '../actions';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Spinner from '../components/Spinner';
import './App.css';

class App extends Component {
  static propTypes = {
    children: PropTypes.node,
    error: PropTypes.string,
    isFetching: PropTypes.bool.isRequired,
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

  renderSpinner() {
    if (this.props.isFetching) return <Spinner />;
  }

  renderErrorMessage() {
    const { error } = this.props;
    if (error) {
      return (
        <p className="error-bar">
          <b>{error}</b>
          <a href="#" onClick={this.handleDismissClick.bind(this)}>
            {' '}Dismiss
          </a>
        </p>
      );
    }
  }

  render() {
    return (
      <main className="main">
        <Header />
        {this.renderSpinner()}
        {this.renderErrorMessage()}
        {this.props.children}
        <Footer />
      </main>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    error: state.get('error'),
    isFetching: state.getIn(['pagination', 'isFetching'])
  };
}

export default connect(mapStateToProps, {
  resetErrorMessage
})(App);
