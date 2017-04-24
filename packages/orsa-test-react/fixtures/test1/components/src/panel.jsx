import React from 'react';
import PropTypes from 'prop-types';

/**
Panel component
@author Jack
*/
const Panel = ({ title, disabled, children, }) => (
  <div
    className={[
      'panel',
      disabled ? 'disabled' : '',
    ].join(' ')}
  >
    <h1>{title}</h1>
    <div>
      {children}
    </div>
  </div>
);

Panel.propTypes = {
  /**
  Title for the panel
  */
  title: PropTypes.string,

  /**
  True if the panel is disabled
  */
  disabled: PropTypes.bool,

  /**
  Child elements
  */
  children: PropTypes.element,
};

Panel.defaultProps = {
  title: 'foo!',
  disabled: false,
  children: null,
};

export default Panel;
