/* eslint no-undef: 0 */
import React from 'react';
import renderer from 'react-test-renderer';

import LoginForm from '../src/login-form';

test('LoginForm outputs something', () => {
  const component = renderer.create(
    <LoginForm />
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
