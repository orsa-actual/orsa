/* eslint no-undef: 0 */
import React from 'react';
import renderer from 'react-test-renderer';

import Select from '../src/select';

test('Select outputs something', () => {
  const component = renderer.create(
    <Select />
  );
  const tree = component.toJSON();
  expect(tree.type).toEqual('select');
});
