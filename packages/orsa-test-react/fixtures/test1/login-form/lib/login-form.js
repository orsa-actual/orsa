'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _button = require('orsa-test1-components/lib/button');

var _button2 = _interopRequireDefault(_button);

var _input = require('orsa-test1-components/lib/input');

var _input2 = _interopRequireDefault(_input);

var _panel = require('orsa-test1-components/lib/panel');

var _panel2 = _interopRequireDefault(_panel);

var _password = require('orsa-test1-components/lib/password');

var _password2 = _interopRequireDefault(_password);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LoginForm = function (_React$Component) {
  _inherits(LoginForm, _React$Component);

  function LoginForm(props) {
    _classCallCheck(this, LoginForm);

    var _this = _possibleConstructorReturn(this, (LoginForm.__proto__ || Object.getPrototypeOf(LoginForm)).call(this, props));

    _this.state = {
      user: props.user,
      password: props.password
    };
    return _this;
  }

  _createClass(LoginForm, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        _panel2.default,
        { title: 'Login' },
        _react2.default.createElement(
          'form',
          null,
          _react2.default.createElement(
            'div',
            { className: 'form-field' },
            _react2.default.createElement(
              'div',
              { className: 'field-title' },
              'Username'
            ),
            _react2.default.createElement(_input2.default, { value: this.state.user })
          ),
          _react2.default.createElement(
            'div',
            { className: 'form-field' },
            _react2.default.createElement(
              'div',
              { className: 'field-title' },
              'Password'
            ),
            _react2.default.createElement(_password2.default, { value: this.state.password })
          ),
          _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(_button2.default, { login: 'Login' })
          )
        )
      );
    }
  }]);

  return LoginForm;
}(_react2.default.Component);

exports.default = LoginForm;


LoginForm.propTypes = {
  user: _propTypes2.default.string,
  password: _propTypes2.default.string
};

LoginForm.defaultProps = {
  user: '',
  password: ''
};