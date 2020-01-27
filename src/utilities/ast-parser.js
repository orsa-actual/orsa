const fs = require('fs');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

module.exports = (fileName) => {
  if (!fileName) {
    return null;
  }
  const fileText = fs.readFileSync(fileName).toString();
  let error = null;
  const lines = fileText.split(/[\n|\r\n]/);
  let ast = null;
  try {
    ast = parser.parse(fileText, {
      sourceType: 'module',
      plugins: [
        'jsx',
        'flow',
        'asyncFunctions',
        'classConstructorCall',
        'doExpressions',
        'trailingFunctionCommas',
        'objectRestSpread',
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
    of parser. So appy that here just to make sure we can later.
    */
    traverse(ast);
  } catch (e) {
    error = e;
  }
  return {
    error,
    lines,
    ast,
    fileText,
  };
};
