import React, { Component, PropTypes} from 'react';
import marked, { Renderer } from 'marked';
import highlight from 'highlight.js';
import PureRenderMixin from 'react-addons-pure-render-mixin';

export default class Markdown extends Component {
  static propTypes = {
    body: PropTypes.string.isRequired,
    noLinks: PropTypes.bool
  }

  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);

    marked.setOptions({
      gfm: true,
      tables: true,
      breaks: true,
      pedantic: false,
      sanitize: false,
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

    // renderer.html = (html) => {
    //   debugger
    //   return html;
    // };
    //
    // renderer.link = (link, opts, str) => {
    //   debugger
    //   return `<a href=${link}>${str}</a>`;
    // };

    return renderer;
  }

  // renderMarkDown(text) {
  //   return new Promise((resolve, reject) => {
  //     marked(text, null, (err, content) => {
  //
  //     });
  //   });
  // }

  render() {
    const { body } = this.props;

    return (
      <div
        className="markdown-text"
        data-text="Nothing here."
        dangerouslySetInnerHTML={{ __html: marked(body) }}
        />
    );
  }
}
