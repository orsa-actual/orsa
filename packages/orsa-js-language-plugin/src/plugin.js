/* eslint class-methods-use-this: 0, quotes: 0, no-param-reassign: 0,
  no-empty: 0, no-confusing-arrow: 0 */

const FileListener = require('orsa-listeners').FileListener;

const traverse = require('babel-traverse').default;
const keys = require('lodash.keys');
const get = require('lodash.get');
const types = require('babel-types');
const doctrine = require('doctrine');

const sortUsages = usages => usages.sort((a, b) => {
  if (a.name < b.name) {
    return -1;
  } else if (a.name > b.name) {
    return 1;
  } else if (a.startLine < b.startLine) {
    return -1;
  } else if (a.startLine > b.startLine) {
    return 1;
  }
  return 0;
});

const parseJSDoc = (doc) => {
  let info = {};
  try {
    info = doctrine.parse(doc, {
      unwrap: true,
      sloppy: true,
    });
  } catch (e) {
  }
  return info;
};

const snipppetExtractor = (lines, start, end) =>
  (lines && start < lines.length) ?
    lines.slice(start - 1, end).join("\n") : '';

const findImportsAndComponents = (ast, lines, usages, imports, classes) =>
  traverse(ast, {
    enter(path) {
      const node = path.node;

      const getSnippet = (start, end) => snipppetExtractor(lines, start, end);

      if (types.isCallExpression(node)) {
        if (get(node, 'callee.name') === 'require') {
          const container = path.container;
          if (container && container.type === 'VariableDeclarator') {
            if (get(container, 'id.name')) {
              imports[container.id.name] = node.arguments[0].value;
            }
            if (get(container, 'id.properties')) {
              keys(container.id.properties).forEach((p) => {
                const prop = container.id.properties[p];
                imports[prop.key.name] = node.arguments[0].value;
              });
            }
          }
        }
      }

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
      if (types.isVariableDeclaration(node)) {
        const decl = node.declarations[0];
        if (decl &&
          get(decl, 'init.callee.object.name') === 'React' &&
          get(decl, 'init.callee.property.name') === 'createClass' &&
          get(decl, 'id.name')) {
          classes.push({
            name: get(decl, 'id.name'),
            startLine: decl.loc.start.line,
            endLine: decl.loc.end.line,
            snippet: getSnippet(decl.loc.start.line, decl.loc.end.line),
          });
        }
      }

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
      if (types.isClassDeclaration(node)) {
        const methods = [];
        get(node, 'body.body', []).forEach((element) => {
          if (get(element, 'kind') !== 'constructor') {
            methods.push({
              kind: get(element, 'kind'),
              name: get(element, 'key.name'),
              params: get(element, 'params', []).map(p => ({
                name: p.name,
                startLine: p.loc.start.line,
                endLine: p.loc.end.line,
                snippet: getSnippet(p.loc.start.line, p.loc.end.line),
              })),
              startLine: element.loc.start.line,
              endLine: element.loc.end.line,
              snippet: getSnippet(element.loc.start.line, element.loc.end.line),
              jsDoc: parseJSDoc(
                get(element, 'leadingComments[0].value', '')
              ),
            });
          }
        });
        classes.push({
          reactComponent: get(
            node, 'superClass.property.name'
          ) === 'Component',
          name: node.id.name,
          superClass: get(node, 'superClass.name'),
          methods,
          startLine: node.loc.start.line,
          endLine: node.loc.end.line,
          snippet: getSnippet(node.loc.start.line, node.loc.end.line),
          jsDoc: parseJSDoc(
            get(node, 'leadingComments[0].value',
              get(path, 'scope.parentBlock.leadingComments[0].value', '')
            )
          ),
        });
      }

      /*
      Handle a simple variations of a stateless component:

      const Foo = (props) => (
        <div>{props.name}</div>
      );
      */
      if (types.isVariableDeclaration(node)) {
        const decl = node.declarations[0];
        if ((get(decl, 'id.name') || '').match(/^[A-Z]/) &&
          get(decl, 'init.type') === 'ArrowFunctionExpression' &&
          get(decl, 'init.body.type') === 'JSXElement') {
          classes.push({
            name: decl.id.name,
            startLine: decl.loc.start.line,
            endLine: decl.loc.end.line,
            snippet: getSnippet(decl.loc.start.line, decl.loc.end.line),
            jsDoc: parseJSDoc(
              get(decl, 'leadingComments[0].value', '')
            ),
          });
        }
      }

      if (types.isImportDeclaration(node)) {
        keys(node.specifiers).forEach((s) => {
          const spec = node.specifiers[s];
          imports[spec.local.name] = node.source.value;
        });
      }

      if (types.isJSXElement(node)) {
        let name = get(node, 'openingElement.name.name');
        let base = get(node, 'openingElement.name.name');
        if (name === undefined) {
          base = node.openingElement.name.object.name;
          name = `${base}.${node.openingElement.name.property.name}`;
        }
        const attributes = [];
        keys(node.openingElement.attributes).forEach((a) => {
          const attr = node.openingElement.attributes[a];
          /* istanbul ignore next */
          if (attr.name && attr.name.name) {
            attributes.push(attr.name.name);
          }
        });

        usages.push({
          name,
          base,
          startLine: node.loc.start.line,
          endLine: node.loc.end.line,
          attributes,
          snippet: getSnippet(node.loc.start.line, node.loc.end.line),
        });
      }
    },
  }
);

class OrsaJsLanguagePlugin extends FileListener {
  shouldProcess(domElement) {
    return domElement.metadata.get('js.ast') &&
      domElement.metadata.get('js.lines') &&
      !domElement.metadata.get('js.usages');
  }

  process(domElement, cb) {
    const usages = [];
    const imports = {};
    const classes = [];

    findImportsAndComponents(
      domElement.metadata.get('js.ast'),
      domElement.metadata.get('js.lines'),
      usages,
      imports,
      classes
    );

    usages.forEach((comp) => {
      if (imports[comp.name]) {
        comp.import = imports[comp.name];
      }
      if (imports[comp.base]) {
        comp.import = imports[comp.base];
      }
    });

    domElement.metadata.set('js.usages', sortUsages(usages));
    domElement.metadata.set('js.imports', imports);
    domElement.metadata.set('js.classes', classes);

    cb();
  }
}

OrsaJsLanguagePlugin.sortUsages = sortUsages;
OrsaJsLanguagePlugin.snipppetExtractor = snipppetExtractor;

module.exports = OrsaJsLanguagePlugin;
