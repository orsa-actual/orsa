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
Input component
@author Jack
*/
var Input = function Input(_ref) {
  var type = _ref.type,
      disabled = _ref.disabled,
      value = _ref.value;
  return _react2.default.createElement('input', { type: type, value: value, disabled: disabled });
};

Input.propTypes = {
  /**
  True if the button is disabled
  */
  disabled: _propTypes2.default.bool,

  /**
  Value of the input
  */
  value: _propTypes2.default.string,

  /**
  Type of the input
  */
  type: _propTypes2.default.string
};

Input.defaultProps = {
  disabled: false,
  value: '',
  type: 'text'
};

exports.default = Input;