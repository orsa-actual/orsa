const merge = require('lodash.merge');
const Base = require('./base');

class JSXText extends Base {
  constructor(start, end, text) {
    super('jsx-text', start, end);
    this.text = text;
  }

  toObject() {
    return merge(super.toObject(), {
      text: this.text,
    });
  }
}

module.exports = JSXText;
