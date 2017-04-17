const babylon = require('babylon');
const fs = require('fs');
const traverse = require('babel-traverse').default;

const astParser = (fileName, options = {
  fs,
}) => {
  const fileText = options.fs.readFileSync(fileName).toString();
  let error = null;
  const lines = fileText.split(/[\n|\r\n]/);
  let ast = null;
  try {
    ast = babylon.parse(fileText, {
      sourceType: 'module',
      plugins: [
        'jsx',
        'flow',
        'asyncFunctions',
        'classConstructorCall',
        'doExpressions',
        'trailingFunctionCommas',
        'objectRestSpread',
        'decorators',
        'classProperties',
        'exportExtensions',
        'exponentiationOperator',
        'asyncGenerators',
        'functionBind',
        'functionSent',
      ],
    });

    /*
    Traverse provides a semantic check on top of the basic syntax check
    of babylon. So appy that here just to make sure we can later.
    */
    traverse(ast);
  } catch (e) {
    error = e;
  }
  return {
    error,
    lines,
    ast,
  };
};

module.exports = astParser;
