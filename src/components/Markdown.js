import React, {Component, PropTypes} from 'react';
import marked, {Renderer} from 'marked';
import highlight from 'highlight.js';
import PureRenderMixin from 'react-addons-pure-render-mixin';

export default class Markdown extends Component {
  static propTypes = {
    body: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);

    marked.setOptions({
      gfm: true,
      tables: true,
      breaks: true,
      pedantic: false,
      sanitize: true,
      smartLists: true,
      smartypants: false,
      renderer: this.highlightRenderer()
    });
  }

  highlightRenderer() {
    const renderer = new Renderer();
    renderer.code = (code) => {
      const highlighted = highlight.highlightAuto(code).value;
      // Render the highlighted code with `hljs` class.
      return `<pre><code class="hljs">${highlighted}</code></pre>`;
    };

    return renderer;
  }

  renderMarkdown(text) {
    return marked(text);
  }

  render() {
    const {body} = this.props;

    return <div className="markdown-text" dangerouslySetInnerHTML={{
      __html: this.renderMarkdown(body)
    }}/>;
  }
}
