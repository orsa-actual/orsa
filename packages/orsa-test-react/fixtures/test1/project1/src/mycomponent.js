import React from 'react';
import PropTypes from 'prop-types';

/**
My Component
@author Jack
@docs http://cnn.com
*/
export default class MyComponent extends React.Component {
  /**
  Should the component be seen
  @param foo The thing to decide about
  @returns True if it should be shown
  */
  shouldShow(foo) {
    return !foo;
  }

  render() {
    return (
      <div>
        What is best in life?
      </div>
    );
  }
}

MyComponent.propTypes = {
  title: PropTypes.string,
};

MyComponent.defaultProps = {
  title: "foo!",
};
