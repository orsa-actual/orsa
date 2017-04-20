const types = require('babel-types');
const keys = require('lodash.keys');

const Import = require('../types/import');

module.exports = (node) => {
  let matched = null;
  if (types.isImportDeclaration(node)) {
    const toKeys = [];
    keys(node.specifiers).forEach((s) => {
      const spec = node.specifiers[s];
      toKeys.push(spec.local.name);
    });
    matched = new Import(
      node.loc.end.line,
      node.loc.start.line,
      node.source.value,
      toKeys
    );
  }
  return matched;
};
