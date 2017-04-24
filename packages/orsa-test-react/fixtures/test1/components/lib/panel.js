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
Panel component
@author Jack
*/
var Panel = function Panel(_ref) {
  var title = _ref.title,
      disabled = _ref.disabled,
      children = _ref.children;
  return _react2.default.createElement(
    'div',
    {
      className: ['panel', disabled ? 'disabled' : ''].join(' ')
    },
    _react2.default.createElement(
      'h1',
      null,
      title
    ),
    _react2.default.createElement(
      'div',
      null,
      children
    )
  );
};

Panel.propTypes = {
  /**
  Title for the panel
  */
  title: _propTypes2.default.string,

  /**
  True if the panel is disabled
  */
  disabled: _propTypes2.default.bool,

  /**
  Child elements
  */
  children: _propTypes2.default.element
};

Panel.defaultProps = {
  title: 'foo!',
  disabled: false,
  children: null
};

exports.default = Panel;