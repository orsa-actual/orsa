import React from 'react';
import PropTypes from 'prop-types';

export default class MyComponent extends React.Component {
  render() {
    return (
      <div>
        Hi there!
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
