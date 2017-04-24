import React from 'react';
import PropTypes from 'prop-types';

/**
Select component
@author Jack
*/
const Select = ({ disabled, children, }) => (
  <select disabled={disabled}>
    {children}
  </select>
);

Select.propTypes = {
  /**
  True if the button is disabled
  */
  disabled: PropTypes.bool,

  /**
  Child elements
  */
  children: PropTypes.element,
};

Select.defaultProps = {
  disabled: false,
  children: null,
};

export default Select;
