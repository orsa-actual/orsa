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
Option component
@author Jack
*/
var Option = function Option(_ref) {
  var value = _ref.value,
      disabled = _ref.disabled,
      children = _ref.children;
  return _react2.default.createElement(
    'option',
    { value: value, disabled: disabled },
    children
  );
};

Option.propTypes = {
  /**
  True if the button is disabled
  */
  disabled: _propTypes2.default.bool,

  /**
  Value of the option
  */
  value: _propTypes2.default.string,

  /**
  Child elements
  */
  children: _propTypes2.default.arrayOf(_propTypes2.default.element)
};

Option.defaultProps = {
  disabled: false,
  value: '',
  children: []
};

exports.default = Option;