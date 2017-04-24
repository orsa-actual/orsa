/* eslint no-undef: 0 */
import React from 'react';
import renderer from 'react-test-renderer';

import Option from '../src/option';

test('Option outputs something', () => {
  const component = renderer.create(
    <Option value="20" />
  );
  const tree = component.toJSON();
  expect(tree.type).toEqual('option');
  expect(tree.props.value).toEqual('20');
});
