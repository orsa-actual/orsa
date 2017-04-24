/* eslint no-undef: 0 */
import React from 'react';
import renderer from 'react-test-renderer';

import Password from '../src/password';

test('Password outputs something', () => {
  const component = renderer.create(
    <Password />
  );
  const tree = component.toJSON();
  expect(tree.type).toEqual('input');
  expect(tree.props.type).toEqual('password');
});
