/* eslint no-undef: 0 */
import React from 'react';
import renderer from 'react-test-renderer';

import Panel from '../src/panel';

test('Panel outputs something', () => {
  const component = renderer.create(
    <Panel />
  );
  const tree = component.toJSON();
  expect(tree.type).toEqual('div');
});
