/* eslint no-undef: 0 */
import React from 'react';
import renderer from 'react-test-renderer';

import Simple from '../src/simple';

test('Simple outputs something', () => {
  const component = renderer.create(
    <Simple>Facebook</Simple>
  );
  const tree = component.toJSON();
  expect(tree.type).toEqual('div');
  expect(tree.children[0]).toEqual('Hi there!');
});
