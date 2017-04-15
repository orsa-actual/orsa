const babylon = require('babylon');
const fs = require('fs');

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
