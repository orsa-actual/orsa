import React from 'react';
import Button from 'orsa-test1-components/lib/button';
import Panel from 'orsa-test1-components/lib/panel';
import LoginForm from 'orsa-test1-login-form/lib/login-form';

export default class CheckoutApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
    };
  }

  render() {
    return (
      <Panel title="Checkout">
        You need to login before you can checkout.
        <LoginForm />
        <Button disabled={!this.state.loggedIn} title="Checkout" />
      </Panel>
    );
  }
}
