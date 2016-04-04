import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { browserHistory } from 'react-router';
import { Map } from 'immutable';

export default class PaginationList extends Component {
  static propTypes = {
    pageUrls: PropTypes.instanceOf(Map).isRequired
  }

  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  getLastPageNum(url) {
    if (!url) {
      return 0;
    }

    // find a better way to parse the query string here
    return parseInt(url.match(/(\d+)(?!.*\d)/)[0]);
  }

  renderPageLink(pageNum) {
    const { pageUrls } = this.props;
    const nextPageUrl = pageUrls.get('nextPageUrl') || '';
    return nextPageUrl.slice(0, -1) + pageNum;
  }

  renderPageListItems() {
    const { pageUrls } = this.props;
    const lastPageNum = this.getLastPageNum(pageUrls.get('lastPageUrl'));

    let pageItems = [];
    for (let i=1; i <= lastPageNum; i++) {
      if (i > 10) { continue; }
      pageItems.push(
        <li key={i}>
          <a href={this.renderPageLink(i)}>{i}</a>
        </li>
      );
    }

    return pageItems;
  }

  render() {
    let pageListItems = this.renderPageListItems();

    return (
      <ul className="page-list">
        {pageListItems}
      </ul>
    );
  }
}
