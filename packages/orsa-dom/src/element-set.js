const Base = require('./base');
const assign = require('lodash.assign');

class ElementSet extends Base {
  constructor(parent, options) {
    super(parent);
    this.nodes = [];
    this.options = assign({
      identityMatchers: [],
    }, options);
  }

  findDuplicate(node) {
    let duplicate = null;
    this.options.identityMatchers.forEach((matcher) => {
      this.nodes.forEach((child) => {
        if (matcher(node, child)) {
          duplicate = child;
        }
      });
    });
    return duplicate;
  }

  add(node) {
    const duplicateNode = this.findDuplicate(node);
    let realNode = node;
    if (duplicateNode) {
      duplicateNode.merge(node);
      this.emit(ElementSet.ADD, duplicateNode);
      realNode = duplicateNode;
    } else {
      this.nodes.push(node);
      this.emit(ElementSet.ADD, node);
    }
    return realNode;
  }

  remove(node) {
    this.nodes = this.nodes.filter(n => n !== node);
    this.emit(ElementSet.REMOVE, node);
  }

  find(pattern) {
    return this.toArray().filter(c => c.match(pattern));
  }

  toArray() {
    return this.nodes;
  }
}

ElementSet.ADD = 'ElementSet.ADD';
ElementSet.REMOVE = 'ElementSet.REMOVE';

module.exports = ElementSet;
