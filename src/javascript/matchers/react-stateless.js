const types = require('@babel/types');
const get = require('lodash.get');

const ReactClass = require('../../types/react-class');
const parseJSDoc = require('../jsdoc');

/*
Handle a simple variations of a stateless component:

const Foo = (props) => (
  <div>{props.name}</div>
);
*/
module.exports = (node) => {
  let matched = null;
  if (types.isVariableDeclaration(node)) {
    const decl = node.declarations[0];
    if (
      get(decl, 'id.name', '').match(/^[A-Z]/) &&
      get(decl, 'init.type') === 'ArrowFunctionExpression' &&
      get(decl, 'init.body.type') === 'JSXElement'
    ) {
      matched = new ReactClass(
        decl.loc.start.line,
        decl.loc.end.line,
        decl.id.name
      );
      matched.jsDoc = parseJSDoc(
        get(decl, 'leadingComments[0].value', '')
      );
      matched.metadata.stateless = true;
    }
  }
  return matched;
};
