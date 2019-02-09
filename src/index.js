class HTMLApp {
  constructor(opts) {
    this.root = this.getRootElement();

    if (opts.onLoad) {
      const nodes = this.getNodes();

      opts.onLoad(nodes);
    }
  }

  getRootElement() {
    return document.querySelector('[data-htmlapp]');
  }

  getNodes() {
    const nodes = this.root.querySelectorAll('[data-sa]');

    return nodes.map(node => ({
      setHtml: htmlStr => {
        node.innerHTML = htmlStr;
      }
    }));
  }
}

export default HTMLApp;
