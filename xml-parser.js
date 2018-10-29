class XmlParser {
  constructor() {
    this.url = new URLSearchParams(window.location.search).get('XML');
    this.ids = {};
    this.internalLinks = {};
    this.textLength = 0;
    this.normalizedTextLength = 0;
    this.invalidLinksAmount = 0;
    this.dataArea = document.querySelector('.data-area');
  }

  init() {
    this.loadData();
  }

  loadData() {
    if (this.url) {
      fetch(this.url)
        .then(response => response.text())
        .then(text => new DOMParser().parseFromString(text, 'application/xml'))
        .then(data => this.parseData(data.documentElement, true, this.printData.bind(this)))
        .catch(err => console.error(err));
    } else {
      throw new Error('XML query param is missing');
    }
  }

  /**
   * @param {Node} node
   * @param {Boolean} isRoot - detect root element
   * @param {Function} [callback]
   */
  parseData(node, isRoot, callback = null) {
    node.childNodes.forEach(childNode => {
      if (childNode.nodeType === 1) {
        this.parseNodeAttributes(childNode);
        this.parseData(childNode, false);
      }
    });

    if (isRoot) {
      this.textLength = node.textContent.replace(/[^a-zA-Zа-яА-Я]/g, '').length;
      node.normalize();
      this.normalizedTextLength = node.textContent.replace(/[^a-zA-Zа-яА-Я\s]/g, '').length;
      this.checkInvalidLinks(this.internalLinks, this.ids);
      if (typeof callback === 'function') {
        callback();
      }
    }
  }

  /**
   * @param {Node} node
   */
  parseNodeAttributes(node) {
    const isLink = node.tagName === 'a';
    const lHref = node.getAttribute('l:href');
    const id = node.getAttribute('id');

    const isInternalLink = isLink && (lHref !== null) && lHref.startsWith('#');

    if (isInternalLink) {
      this.internalLinks[lHref.slice(1)] = lHref;
    }

    if (!isLink && (id !== null)) {
      this.ids[id] = id;
    }
  }

  /**
   * @param {Object} links - all parsed links
   * @param {Object} ids - all parsed ids
   */
  checkInvalidLinks(links, ids) {
    Object.keys(links).forEach(link => {
      if (!ids.hasOwnProperty(link)) {
        this.invalidLinksAmount++;
      }
    });
  }

  printData() {
    this.dataArea.querySelector('.internal-links-all i').innerText = Object.keys(this.internalLinks).length;
    this.dataArea.querySelector('.characters-amount i').innerText = this.textLength;
    this.dataArea.querySelector('.normalized i').innerText = this.normalizedTextLength;
    this.dataArea.querySelector('.invalid-links-amount i').innerText = this.invalidLinksAmount;
  }
}