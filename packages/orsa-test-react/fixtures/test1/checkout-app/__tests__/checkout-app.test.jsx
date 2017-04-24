/* eslint no-undef: 0 */
import React from 'react';
import renderer from 'react-test-renderer';

import CheckoutApp from '../src/checkout-app';

test('CheckoutApp outputs something', () => {
  const component = renderer.create(
    <CheckoutApp />
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
