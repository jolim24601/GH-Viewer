import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class PaginationList extends Component {
  static propTypes = {
    currentPage: PropTypes.number.isRequired,
    lastPage: PropTypes.number.isRequired,
    pathname: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);
  }

  pageIsTooFar(i, currentPage, lastPage) {
    return ((i < currentPage - 1 || i > currentPage + 1) &&
              i > 2 && i < lastPage);
  }

  getPath(page) {
    const { pathname } = this.props;

    return {
      pathname,
      query: { page: `${page}` }
    };
  }

  renderBookend(rel, page) {
    const { currentPage, lastPage } = this.props;
    page = page <= 0 ? 1 : page;
    page = page > lastPage ? lastPage : page;

    return (
      <li key={rel}>
        <Link
          to={this.getPath(page)}
          className='page-item'
          activeClassName='disabled'
          rel={rel.toUpperCase()}
          disabled={page === currentPage || page === lastPage}>
          {rel}
        </Link>
      </li>
    );
  }

  renderGapsAndPageLinks(page) {
    const { currentPage, lastPage } = this.props;

    if (this.pageIsTooFar(page, currentPage, lastPage)) {
      if (page === currentPage - 3 || page === currentPage + 3) {
        return <span className="gap">...</span>;
      }
    } else {
      return (
        <Link
          to={this.getPath(page)}
          className='page-item'
          activeClassName='active'>
          {page}
        </Link>
      );
    }
  }

  renderPageListItems() {
    const { currentPage, lastPage } = this.props;
    if (lastPage <= 1) return null;

    let pageItems = [];
    if (lastPage > 8) {
      pageItems.push(this.renderBookend('First', 1));
      pageItems.push(this.renderBookend('Prev', currentPage - 1));
    }

    for (let i=1; i <= lastPage; i++) {
      pageItems.push(
        <li key={i}>
          {this.renderGapsAndPageLinks(i)}
        </li>
      );
    }

    if (lastPage > 8) {
      pageItems.push(this.renderBookend('Next', currentPage + 1));
      pageItems.push(this.renderBookend('Last', lastPage));
    }

    return pageItems;
  }

  render() {
    return (
      <ul className="page-list">
        {this.renderPageListItems()}
      </ul>
    );
  }
}
