import React from 'react';
import Button from 'orsa-test1-components/lib/button';
import Input from 'orsa-test1-components/lib/input';
import Panel from 'orsa-test1-components/lib/panel';
import Password from 'orsa-test1-components/lib/password';
import PropTypes from 'prop-types';

export default class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: props.user,
      password: props.password,
    };
  }
  render() {
    return (
      <Panel title="Login">
        <form>
          <div className="form-field">
            <div className="field-title">
              Username
            </div>
            <Input value={this.state.user} />
          </div>
          <div className="form-field">
            <div className="field-title">
              Password
            </div>
            <Password value={this.state.password} />
          </div>
          <div>
            <Button login="Login" />
          </div>
        </form>
      </Panel>
    );
  }
}

LoginForm.propTypes = {
  user: PropTypes.string,
  password: PropTypes.string,
};

LoginForm.defaultProps = {
  user: '',
  password: '',
};
