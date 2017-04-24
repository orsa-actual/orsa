import React from 'react';
import PropTypes from 'prop-types';

/**
Input component
@author Jack
*/
const Input = ({ type, disabled, value, }) => (
  <input type={type} value={value} disabled={disabled} />
);

Input.propTypes = {
  /**
  True if the button is disabled
  */
  disabled: PropTypes.bool,

  /**
  Value of the input
  */
  value: PropTypes.string,

  /**
  Type of the input
  */
  type: PropTypes.string,
};

Input.defaultProps = {
  disabled: false,
  value: '',
  type: 'text',
};

export default Input;
