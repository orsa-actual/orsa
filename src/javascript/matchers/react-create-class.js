const types = require('babel-types');
const get = require('lodash.get');

const ReactClass = require('../../types/react-class');

/*
Handle a createClass variation, even though it's deprecated.

const Bar = React.createClass({
  render: () => {
    return (
      <div>
      </div>
     );
  },
});
*/
module.exports = (node) => {
  let matched = null;
  if (types.isVariableDeclaration(node)) {
    const decl = node.declarations[0];
    if (decl &&
      get(decl, 'init.callee.object.name') === 'React' &&
      get(decl, 'init.callee.property.name') === 'createClass' &&
      get(decl, 'id.name')
    ) {
      matched = new ReactClass(
        decl.loc.start.line,
        decl.loc.end.line,
        get(decl, 'id.name')
      );
    }
  }
  return matched;
};
