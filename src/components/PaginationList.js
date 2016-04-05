import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { Link } from 'react-router';

export default class PaginationList extends Component {
  static propTypes = {
    currentPage: PropTypes.number.isRequired,
    lastPage: PropTypes.number.isRequired
  }

  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  pageIsTooFar(i, currentPage, lastPage) {
    return ((i < currentPage - 2 || i > currentPage + 2) &&
              i > 2);
  }

  renderBookend(rel, page) {
    const { currentPage, lastPage } = this.props;
    page = page <= 0 ? 1 : page;
    page = page > lastPage ? lastPage : page;

    return (
      <li key={rel}>
        <Link
          rel={rel.toUpperCase()}
          to={{ pathname: 'issues', query: { page:  `${page}` } }}
          className={'page-item'}
          disabled={page === currentPage || page === lastPage}
          >
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
          to={{ pathname: 'issues', query: { page:  `${page}` } }}
          className={page === currentPage ? 'page-item active' : 'page-item'}
          >
            {page}
        </Link>
      );
    }
  }

  renderPageListItems() {
    const { currentPage, lastPage } = this.props;

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
