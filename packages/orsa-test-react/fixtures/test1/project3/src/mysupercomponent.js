import React from 'react';
import { MyComponent } from 'project1';
import { MyParentComponent } from 'project2';

export default class MySuperComponent extends React.Component {
  render() {
    return (
      <div>
        <MyComponent title="foo" />
        <MyParentComponent enabled />
        Hi there!
      </div>
    );
  }
}
