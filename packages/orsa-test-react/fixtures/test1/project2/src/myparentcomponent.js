import React from 'react';
import { MyComponent } from 'project1';

export default class MyParentComponent extends React.Component {
  render() {
    return (
      <div>
        <MyComponent title="foo" />
        Hi there!
      </div>
    );
  }
}
