/* eslint no-undef: 0 */
import React from 'react';
import renderer from 'react-test-renderer';

import MyComponent from '../src/mycomponent';

test('MyComponent outputs something', () => {
  const component = renderer.create(
    <MyComponent />
  );
  const tree = component.toJSON();
  expect(tree.type).toEqual('div');
  expect(tree.children[0]).toEqual('What is best in life?');
});
