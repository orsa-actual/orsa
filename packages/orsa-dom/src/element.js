/* eslint class-methods-use-this: 0 */
const merge = require('lodash.merge');
const keys = require('lodash.keys');

const Base = require('./base');
const OrsaMetadata = require('./metadata');
const ElementSet = require('./element-set');

class Element extends Base {
  constructor(parent, metadata) {
    super(parent);

    this.metadata = new OrsaMetadata(this, metadata);
    this.metadata.on(OrsaMetadata.UPDATE,
      (md, info) => this.emit(OrsaMetadata.UPDATE, info)
    );
    this.metadata.on(OrsaMetadata.DELETE,
      (md, info) => this.emit(OrsaMetadata.DELETE, info)
    );

    this.children = new ElementSet(this, this.childrenSetOptions);
  }

  get childrenSetOptions() {
    return {};
  }

  save() {
    return merge(super.save(), {
      children: this.children.toArray().map(c => c.save()),
    });
  }

  merge(node) {
    super.merge(node);
    this.metadata.merge(node.metadata);
  }

  find(pattern) {
    return this.children.find(pattern);
  }

  match(pattern) {
    let match = super.match(pattern);
    if (match) {
      keys(pattern).forEach((k) => {
        if (match) {
          if (k === 'metadata') {
            match = this.metadata.match(pattern[k]);
          } else {
            match = this[k] === pattern[k];
          }
        }
      });
    }
    return match;
  }

  restore(data) {
    super.restore(data);
    data.children.forEach((c) => {
      this.children.add(this.top.restoreNode(this, c));
    });
  }
}

module.exports = Element;
