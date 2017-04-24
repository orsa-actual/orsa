import React from 'react';
import PropTypes from 'prop-types';

/**
Button component
@author Jack
*/
const Button = ({ title, disabled, }) => (
  <button disabled={disabled}>
    {title}
  </button>
);

Button.propTypes = {
  /**
  Title for the button
  */
  title: PropTypes.string,

  /**
  True if the button is disabled
  */
  disabled: PropTypes.bool,
};

Button.defaultProps = {
  title: 'foo!',
  disabled: false,
};

export default Button;
