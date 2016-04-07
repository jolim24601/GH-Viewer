import React, { Component, PropTypes} from 'react';
import marked, { Renderer } from 'marked';
import highlight from 'highlight.js';

export default class Markdown extends Component {
  static propTypes = {
    body: PropTypes.string.isRequired,
    noLinks: PropTypes.bool
  }

  constructor(props) {
    super(props);

    marked.setOptions({
      gfm: true,
      tables: true,
      breaks: true,
      pedantic: false,
      sanitize: true,
      smartLists: true,
      smartypants: false,
      renderer: this.renderer()
    });
  }

  renderer() {
    const renderer = new Renderer();
    renderer.code = (code) => {
      const highlighted = highlight.highlightAuto(code).value;
      // Render the highlighted code with `hljs` class.
      return `<pre><code class="hljs">${highlighted}</code></pre>`;
    };

    // remove any links if this is a teaser
    if (this.props.noLinks) {
      renderer.link = (link, opts, str) => str ? str : link;
      return renderer;
    }

    return renderer;
  }

  render() {
    const { body } = this.props;

    return (
      <div
        className="markdown-text"
        data-text="Nothing here."
        dangerouslySetInnerHTML={{ __html: marked(body) }} />
    );
  }
}
