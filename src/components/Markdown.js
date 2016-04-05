import React, { Component, PropTypes} from 'react';
import marked, { Renderer } from 'marked';
import highlight from 'highlight.js';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import { fetchUser } from '../actions';

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

    if (this.props.noLinks) {
      renderer.link = (link) => link;
      return renderer;
    }

    // renderer.paragraph = (p) => {
    //   const tagRegex = /@\w+/;
    //   let tags = text.match(tagRegex);
    //
    //   fetchUser()
    //     .then(() => {
    //
    //     });
    //   return p.replace(tagRegex, () => {
    //     return
    //   });
    // };

    return renderer;
  }

  renderMarkdown(text) {
    findAndTagUsers(text);
    return marked(text);
  }

  render() {
    const {body} = this.props;

    return <div className="markdown-text" dangerouslySetInnerHTML={{
      __html: this.renderMarkdown(body)
    }}/>;
  }
}
