/* eslint no-undef: 0 */
const merge = require('lodash.merge');
const keys = require('lodash.keys');
const set = require('lodash.set');
const get = require('lodash.get');
const Base = require('./base');

class MetaData extends Base {
  constructor(orsa, metadata = {}) {
    super(orsa, null);
    this.metadata = metadata;
    this.temporary = {};
    this.type = MetaData.TYPE;
  }

  merge(metadataObject) {
    this.metadata = merge(
      this.metadata,
      metadataObject.metadata
    );
    this.temporary = merge(
      this.temporary,
      metadataObject.temporary
    );
  }

  match(pattern) {
    let match = true;
    keys(pattern).forEach((k) => {
      if (match) {
        if (get(this.metadata, k) === pattern[k] || get(this.temporary, k) === pattern[k]) {
          match = true;
        } else {
          match = false;
        }
      }
    });
    return match;
  }

  set(key, value, options = {}) {
    if (options.temporary) {
      set(this.temporary, key, value);
    } else {
      set(this.metadata, key, value);
    }
    this.emit(MetaData.UPDATE, { key, value, });
  }

  get(key) {
    return get(this.metadata, key, null) || get(this.temporary, key, null);
  }

  save() {
    return merge(super.save(), {
      metadata: this.metadata,
    });
  }

  restore(data) {
    super.restore(data);
    this.metadata = data.metadata;
  }

  toObject() {
    return this.metadata;
  }
}

MetaData.UPDATE = 'MetaData:UPDATE';

MetaData.TYPE = 'MetaData';

module.exports = MetaData;
