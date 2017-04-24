/* eslint no-undef: 0 */
import React from 'react';
import renderer from 'react-test-renderer';

import Input from '../src/input';

test('Input outputs something', () => {
  const component = renderer.create(
    <Input />
  );
  const tree = component.toJSON();
  expect(tree.type).toEqual('input');
  expect(tree.props.type).toEqual('text');
});
