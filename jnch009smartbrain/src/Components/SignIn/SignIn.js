import React, { Component } from 'react';

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signInEmail: '',
      signInPassword: '',
    };
  }

  onEmailChange = e => {
    this.setState({ signInEmail: e.target.value });
  };

  onPasswordChange = e => {
    this.setState({ signInPassword: e.target.value });
  };

  onKeyPress = e => {
    if (e.key === 'Enter') {
      this.onSubmitSignIn();
    }
  };

  onSubmitSignIn = () => {
    // POST Request
    fetch('https://whispering-crag-84898.herokuapp.com/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: this.state.signInEmail,
        password: this.state.signInPassword,
      }),
    })
      .then(resp => resp.json())
      .then(data => {
        if (data?.id) {
          localStorage.setItem(
            'currentSession',
            JSON.stringify({
              data,
              ...this.props.sessionExp(),
            }),
          );
          this.props.loadUser(data);
          this.props.onRouteChange('home');
        } else {
          this.props.setError(data);
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
                  onKeyPress={this.onKeyPress}
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
                  onKeyPress={this.onKeyPress}
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
