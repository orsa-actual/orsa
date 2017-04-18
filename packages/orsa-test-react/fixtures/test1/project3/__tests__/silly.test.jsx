/* eslint no-undef: 0 */
import React from 'react';
import renderer from 'react-test-renderer';

import Silly from '../src/silly';

test('Silly outputs something', () => {
  const component = renderer.create(
    <Silly>Facebook</Silly>
  );
  const tree = component.toJSON();
  expect(tree.type).toEqual('strong');
  expect(tree.children[0]).toEqual('Hi there!');
});
