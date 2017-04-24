import React from 'react';
import PropTypes from 'prop-types';

/**
Option component
@author Jack
*/
const Option = ({ value, disabled, children, }) => (
  <option value={value} disabled={disabled}>
    {children}
  </option>
);

Option.propTypes = {
  /**
  True if the button is disabled
  */
  disabled: PropTypes.bool,

  /**
  Value of the option
  */
  value: PropTypes.string,

  /**
  Child elements
  */
  children: PropTypes.arrayOf(PropTypes.element),
};

Option.defaultProps = {
  disabled: false,
  value: '',
  children: [],
};

export default Option;
