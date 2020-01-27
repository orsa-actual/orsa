const traverse = require('@babel/traverse').default;

module.exports = (ast, matchers = []) => {
  const features = [];
  const errors = [];
  traverse(ast, {
    enter(path) {
      matchers.forEach((matcher) => {
        let found = null;
        try {
          found = matcher(path.node, path);
        } catch (e) {
          errors.push(e);
        }
        if (found) {
          features.push(found.toObject());
        }
      });
    },
  });
  return {
    features,
    errors,
  };
};
