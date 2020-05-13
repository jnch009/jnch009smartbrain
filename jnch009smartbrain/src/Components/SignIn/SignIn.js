import React, { Component } from 'react';

//20 minutes
const expiry = 20;

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signInEmail: '',
      signInPassword: '',
    };
  }

  setSessionExpiry = () => {
    let timestamp = new Date();
    timestamp.setMinutes(timestamp.getMinutes() + expiry);
    return { curr: new Date(), exp: timestamp };
  };

  onEmailChange = e => {
    this.setState({ signInEmail: e.target.value });
  };

  onPasswordChange = e => {
    this.setState({ signInPassword: e.target.value });
  };

  onSubmitSignIn = () => {
    // POST Request
    fetch('http://localhost:3000/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: this.state.signInEmail,
        password: this.state.signInPassword,
      }),
    })
      .then(resp => {
        if (resp.status === 200) {
          return resp.json();
        }
      })
      .then(data => {
        if (data?.id) {
          localStorage.setItem(
            'currentSession',
            JSON.stringify({
              data,
              ...this.setSessionExpiry(),
            }),
          );
          this.props.loadUser(data);
          this.props.onRouteChange('home');
        }
      });
  };

  render() {
    const { onRouteChange } = this.props;
    return (
      <article className='br3 shadow-5 ba dark-gray b--black-10 mv4 w-100 w-50-m w-25-l mw7 center'>
        <main className='pa4 black-80'>
          <div className='measure'>
            <fieldset id='sign_up' className='ba b--transparent ph0 mh0'>
              <legend className='f1 fw6 ph0 mh0'>Sign In</legend>
              <div className='mt3'>
                <label className='db fw6 lh-copy f6' htmlFor='email-address'>
                  Email
                </label>
                <input
                  className='pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100'
                  type='email'
                  name='email-address'
                  id='email-address'
                  onInput={this.onEmailChange}
                />
              </div>
              <div className='mv3'>
                <label className='db fw6 lh-copy f6' htmlFor='password'>
                  Password
                </label>
                <input
                  className='b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100'
                  type='password'
                  name='password'
                  id='password'
                  onInput={this.onPasswordChange}
                />
              </div>
            </fieldset>
            <div className=''>
              <input
                className='b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib'
                type='submit'
                onClick={this.onSubmitSignIn}
                value='Sign in'
              />
            </div>
            <div className='lh-copy mt3'>
              <p
                onClick={() => onRouteChange('Register')}
                className='f6 link dim black db pointer'
              >
                Register
              </p>
            </div>
          </div>
        </main>
      </article>
    );
  }
}

export default SignIn;
