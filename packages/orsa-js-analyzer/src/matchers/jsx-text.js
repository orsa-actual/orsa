const types = require('babel-types');

const JSXText = require('../types/jsx-text');

module.exports = (node) => {
  let matched = null;
  if (types.isJSXText(node)) {
    const text = node.value.toString().trim();
    if (text.length > 0) {
      matched = new JSXText(
        node.loc.start.line,
        node.loc.end.line,
        text
      );
    }
  }
  return matched;
};
