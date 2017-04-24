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
Select component
@author Jack
*/
var Select = function Select(_ref) {
  var disabled = _ref.disabled,
      children = _ref.children;
  return _react2.default.createElement(
    'select',
    { disabled: disabled },
    children
  );
};

Select.propTypes = {
  /**
  True if the button is disabled
  */
  disabled: _propTypes2.default.bool,

  /**
  Child elements
  */
  children: _propTypes2.default.element
};

Select.defaultProps = {
  disabled: false,
  children: null
};

exports.default = Select;