/* eslint no-undef: 0 */
import React from 'react';
import renderer from 'react-test-renderer';

import Button from '../src/button';

test('Button outputs something', () => {
  const component = renderer.create(
    <Button />
  );
  const tree = component.toJSON();
  expect(tree.type).toEqual('button');
  expect(tree.children[0]).toEqual('foo!');
});
