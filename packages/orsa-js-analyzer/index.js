/* eslint global-require: 0 */
module.exports = {
  runner: require('./src/runner'),
  allMatchers: require('./src/matchers'),
  visit: require('./src/visit'),
  matchers: {
    class: require('./src/matchers/class'),
    import: require('./src/matchers/import'),
    'jsx-usage': require('./src/matchers/jsx-usage'),
    'react-create-class': require('./src/matchers/react-create-class'),
    'react-stateless': require('./src/matchers/react-stateless'),
    'require-import': require('./src/matchers/require-import'),
  },
  types: {
    Base: require('./src/types/base'),
    Class: require('./src/types/class'),
    Import: require('./src/types/import'),
    JSXUsage: require('./src/types/jsx-usage'),
    JSXText: require('./src/types/jsx-text'),
    Method: require('./src/types/method'),
    Parameter: require('./src/types/parameter'),
    ReactClass: require('./src/types/react-class'),
  },
};
