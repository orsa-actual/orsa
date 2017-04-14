/* eslint object-shorthand: 0, func-names: 0 */
const EventEmitter = require('events');
const assign = require('lodash.assign');
const merge = require('lodash.merge');
const keys = require('lodash.keys');

class OrsaBase extends EventEmitter {
  constructor(parent) {
    super();

    this.parent = parent;

    let top = parent;
    while (top && top.parent) {
      top = top.parent;
    }
    this.top = top || this;
    this.orsa = top || this;

    this.type = '';
    this.persistedAttributes = {};
  }

  setPersistedAttributes(attrs) {
    attrs.forEach((attribute) => {
      this.persistedAttributes[attribute] = undefined;
      Object.defineProperty(this, attribute, {
        get: function () {
          return this.persistedAttributes[attribute];
        },
        set: function (value) {
          this.persistedAttributes[attribute] = value;
          this.emit(OrsaBase.CHANGED, {
            attribute,
            value,
          });
        },
      });
    });
  }

  merge(node) {
    this.persistedAttributes = assign(
      this.persistedAttributes,
      node.persistedAttributes
    );
  }

  emit(name, data) {
    super.emit(name, this, data);
    if (this.top !== this) {
      this.top.emit(name, this, data);
    }
  }

  match(pattern) {
    return pattern.type !== undefined ?
      pattern.type === this.type : true;
  }

  save() {
    return merge({
      type: this.type,
    }, this.persistedAttributes);
  }

  restore(data) {
    this.type = data.type;
    keys(this.persistedAttributes).forEach((k) => {
      this[k] = data[k];
    });
  }
}

OrsaBase.CHANGED = 'OrsaBase.CHANGED';

module.exports = OrsaBase;
