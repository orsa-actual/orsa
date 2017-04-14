const merge = require('lodash.merge');
const keys = require('lodash.keys');
const set = require('lodash.set');
const pickBy = require('lodash.pickby');
const mapValues = require('lodash.mapvalues');
const Base = require('./base');

class MetaData extends Base {
  constructor(orsa, metadata, options) {
    super(orsa, null);
    this.metadata = metadata ? mapValues(metadata, value => ({
      options: {},
      value,
    })) : {};
    this.options = options || {};
    this.type = MetaData.TYPE;
  }

  merge(metadataObject) {
    this.metadata = merge(
      this.metadata,
      metadataObject.metadata
    );
  }

  match(pattern) {
    let match = true;
    keys(pattern).forEach((k) => {
      if (match) {
        if (this.metadata[k] && this.metadata[k].value === pattern[k]) {
          match = true;
        } else {
          match = false;
        }
      }
    });
    return match;
  }

  set(key, value, options) {
    set(this.metadata, key, {
      value,
      options: options || {},
    });
    this.emit(MetaData.UPDATE, { key, value, options, });
  }

  get(key) {
    return this.metadata[key] ? this.metadata[key].value : null;
  }

  getOptions(key) {
    return this.metadata[key] ? this.metadata[key].options : null;
  }

  delete(key) {
    delete this.metadata[key];
    this.emit(MetaData.DELETE, { key, });
  }

  get withoutTemporary() {
    return pickBy(this.metadata, v => !v.options.temporary);
  }

  save() {
    return merge(super.save(), { metadata: this.withoutTemporary, });
  }

  restore(data) {
    super.restore(data);
    this.metadata = data.metadata;
  }

  toObject() {
    return mapValues(this.withoutTemporary, v => v.value);
  }
}

MetaData.UPDATE = 'MetaData:UPDATE';
MetaData.DELETE = 'MetaData:DELETE';

MetaData.TYPE = 'MetaData';

module.exports = MetaData;
