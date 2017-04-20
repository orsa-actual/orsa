const types = require('babel-types');
const get = require('lodash.get');

const ReactClass = require('../types/react-class');
const ClassDefinition = require('../types/class');
const Method = require('../types/method');
const Parameter = require('../types/parameter');
const parseJSDoc = require('../jsdoc');

/*
Handle a simple variations of a class component:

export default class MyComponent extends React.Component {
  render() {
    return (
      <div>
        Foo
      </div>
    );
  }
}
*/
module.exports = (node, path) => {
  let matched = null;
  if (types.isClassDeclaration(node)) {
    if (get(node, 'superClass.property.name') === 'Component') {
      matched = new ReactClass(
        node.loc.start.line,
        node.loc.end.line,
        node.id.name
      );
    } else {
      matched = new ClassDefinition(
        node.loc.start.line,
        node.loc.end.line,
        node.id.name
      );
    }
    matched.superClass = get(node, 'superClass.property.name');
    matched.jsDoc = parseJSDoc(
      get(node, 'leadingComments[0].value',
        get(path, 'scope.parentBlock.leadingComments[0].value', '')
      )
    );

    get(node, 'body.body', []).forEach((element) => {
      if (get(element, 'kind') !== 'constructor') {
        const method = new Method(
          element.loc.start.line,
          element.loc.end.line,
          get(element, 'key.name'),
          get(element, 'kind')
        );
        method.jsDoc = parseJSDoc(get(element, 'leadingComments[0].value', ''));
        get(element, 'params', []).forEach((p) => {
          const param = new Parameter(
            p.loc.start.line,
            p.loc.end.line,
            p.name
          );
          method.params.push(param);
        });
        matched.methods.push(method);
      }
    });
  }
  return matched;
};
