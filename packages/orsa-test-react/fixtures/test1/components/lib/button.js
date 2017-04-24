'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
Button component
@author Jack
*/
var Button = function Button(_ref) {
  var title = _ref.title,
      disabled = _ref.disabled;
  return _react2.default.createElement(
    'button',
    { disabled: disabled },
    title
  );
};

Button.propTypes = {
  /**
  Title for the button
  */
  title: _propTypes2.default.string,

  /**
  True if the button is disabled
  */
  disabled: _propTypes2.default.bool
};

Button.defaultProps = {
  title: 'foo!',
  disabled: false
};

exports.default = Button;