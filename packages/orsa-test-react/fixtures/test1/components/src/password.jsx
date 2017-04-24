import React from 'react';
import PropTypes from 'prop-types';

/**
Password component
@author Jack
*/
const Password = ({ type, disabled, value, }) => (
  <input type={type} value={value} disabled={disabled} />
);

Password.propTypes = {
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

Password.defaultProps = {
  disabled: false,
  value: '',
  type: 'password',
};

export default Password;
