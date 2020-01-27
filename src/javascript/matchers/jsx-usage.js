const types = require('@babel/types');
const get = require('lodash.get');

const JSXUsage = require('../../types/jsx-usage');

module.exports = (node) => {
  let matched = null;
  if (types.isJSXElement(node)) {
    let name = get(node, 'openingElement.name.name');
    let base = get(node, 'openingElement.name.name');
    if (name === undefined) {
      base = node.openingElement.name.object.name;
      name = `${base}.${node.openingElement.name.property.name}`;
    }
    const attributes = [];
    Object.keys(node.openingElement.attributes).forEach((a) => {
      const attr = node.openingElement.attributes[a];
      /* istanbul ignore next */
      if (attr.name && attr.name.name) {
        attributes.push(attr.name.name);
      }
    });
    matched = new JSXUsage(
      node.loc.start.line,
      node.loc.end.line,
      name,
      base,
      attributes
    );
  }
  return matched;
};
