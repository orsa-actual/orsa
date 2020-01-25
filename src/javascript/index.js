/* eslint global-require: 0 */
module.exports = {
  runner: require('./runner'),
  allMatchers: require('./matchers'),
  visit: require('./visit'),
  matchers: {
    class: require('./matchers/class'),
    import: require('./matchers/import'),
    'jsx-usage': require('./matchers/jsx-usage'),
    'react-create-class': require('./matchers/react-create-class'),
    'react-stateless': require('./matchers/react-stateless'),
    'require-import': require('./matchers/require-import'),
  },
  types: {
    Base: require('../types/base'),
    Class: require('../types/class'),
    Import: require('../types/import'),
    JSXUsage: require('../types/jsx-usage'),
    JSXText: require('../types/jsx-text'),
    Method: require('../types/method'),
    Parameter: require('../types/parameter'),
    ReactClass: require('../types/react-class'),
  },
};
