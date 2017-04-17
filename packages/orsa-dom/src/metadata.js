/* eslint no-undef: 0 */
const merge = require('lodash.merge');
const keys = require('lodash.keys');
const set = require('lodash.set');
const get = require('lodash.get');
const pickBy = require('lodash.pickby');
const mapValues = require('lodash.mapvalues');
const Base = require('./base');

class MetaData extends Base {
  constructor(orsa, metadata = {}, options = {}) {
    super(orsa, null);
    this.metadata = metadata;
    this.options = options;
    this.type = MetaData.TYPE;
  }

  merge(metadataObject) {
    this.metadata = merge(
      this.metadata,
      metadataObject.metadata
    );
    this.options = merge(
      this.options,
      metadataObject.options
    );
  }

  match(pattern) {
    let match = true;
    keys(pattern).forEach((k) => {
      if (match) {
        if (this.metadata[k] && this.metadata[k] === pattern[k]) {
          match = true;
        } else {
          match = false;
        }
      }
    });
    return match;
  }

  set(key, value, options) {
    set(this.metadata, key, value);
    set(this.options, key, options || {});
    this.emit(MetaData.UPDATE, { key, value, options, });
  }

  get(key) {
    return get(this.metadata, key, null);
  }

  getOptions(key) {
    return get(this.options, key, null);
  }

  delete(key) {
    delete this.metadata[key];
    delete this.options[key];
    this.emit(MetaData.DELETE, { key, });
  }

  get withoutTemporary() {
    return pickBy(this.metadata, (v, k) => !(this.options[k] && this.options[k].temporary));
  }

  get optionsWithoutTemporary() {
    return pickBy(this.options, (v, k) => !(this.options[k] && this.options[k].temporary));
  }

  save() {
    return merge(super.save(), {
      metadata: this.withoutTemporary,
      options: this.optionsWithoutTemporary,
    });
  }

  restore(data) {
    super.restore(data);
    this.metadata = data.metadata;
    this.options = data.options;
  }

  toObject() {
    return mapValues(this.withoutTemporary);
  }
}

MetaData.UPDATE = 'MetaData:UPDATE';
MetaData.DELETE = 'MetaData:DELETE';

MetaData.TYPE = 'MetaData';

module.exports = MetaData;
