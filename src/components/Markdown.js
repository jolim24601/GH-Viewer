import React, { Component, PropTypes } from 'react';
import marked from 'marked';
import highlight from 'highlight.js';
import PureRenderMixin from 'react-addons-pure-render-mixin';

export default class MarkdownViewer extends Component {
  static propTypes = {
    body: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);

    marked.setOptions({
      gfm: true,
      tables: true,
      breaks: false,
      pedantic: false,
      sanitize: true,
      smartLists: true,
      smartypants: false,
      highlight: (code) => highlight.highlightAuto(code).value
    });
  }

  renderMarkdown(text) {
    return marked(text);
  }

  render() {
    const { body } = this.props;

    return <div dangerouslySetInnerHTML={{ __html: this.renderMarkdown(body) }} />;
  }
}
