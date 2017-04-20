const traverse = require('babel-traverse').default;

module.exports = (ast, matchers = []) => {
  const features = [];
  traverse(ast, {
    enter(path) {
      matchers.forEach((matcher) => {
        const found = matcher(path.node, path);
        if (found) {
          features.push(found.toObject());
        }
      });
    },
  });
  return features;
};
