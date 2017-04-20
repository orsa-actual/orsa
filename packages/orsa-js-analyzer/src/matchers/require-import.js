const types = require('babel-types');
const get = require('lodash.get');
const keys = require('lodash.keys');

const Import = require('../types/import');

module.exports = (node, path) => {
  let matched = null;
  if (types.isCallExpression(node)) {
    let from = null;
    const keyNames = [];
    if (get(node, 'callee.name') === 'require') {
      from = node.arguments[0].value;
      const container = path.container;
      if (container && container.type === 'VariableDeclarator') {
        if (get(container, 'id.name')) {
          keyNames.push(container.id.name);
        }
        if (get(container, 'id.properties')) {
          keys(container.id.properties).forEach((p) => {
            const prop = container.id.properties[p];
            keyNames.push(prop.key.name);
          });
        }
      }
      matched = new Import(
        node.loc.start.line,
        node.loc.end.line,
        from,
        keyNames
      );
    }
  }
  return matched;
};
