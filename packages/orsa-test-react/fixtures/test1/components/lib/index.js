'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _button = require('./button');

var _button2 = _interopRequireDefault(_button);

var _input = require('./input');

var _input2 = _interopRequireDefault(_input);

var _password = require('./password');

var _password2 = _interopRequireDefault(_password);

var _select = require('./select');

var _select2 = _interopRequireDefault(_select);

var _option = require('./option');

var _option2 = _interopRequireDefault(_option);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  Button: _button2.default,
  Input: _input2.default,
  Password: _password2.default,
  Select: _select2.default,
  Option: _option2.default
};