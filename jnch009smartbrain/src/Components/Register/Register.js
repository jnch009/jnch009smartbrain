import React, { Component } from 'react';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
    };
  }

  onNameChange = e => {
    this.setState({
      name: e.target.value,
    });
  };

  onEmailChange = e => {
    this.setState({
      email: e.target.value,
    });
  };

  onPasswordChange = e => {
    this.setState({
      password: e.target.value,
    });
  };

  onSubmit = () => {
    fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: this.state.name,
        email: this.state.email,
        password: this.state.password,
      }),
    })
      .then(resp => resp.json())
      .then(data => {
        if (data) {
          localStorage.setItem(
            'currentSession',
            JSON.stringify({
              data,
              ...this.props.sessionExp(),
            }),
          );
          this.props.loadUser(data);
          this.props.onRouteChange('home');
        }
      });
  };

  render() {
    return (
      <article className='br3 shadow-5 ba dark-gray b--black-10 mv4 w-100 w-50-m w-25-l mw7 center'>
        <main className='pa4 black-80'>
          <div className='measure'>
            <fieldset id='sign_up' className='ba b--transparent ph0 mh0'>
              <legend className='f1 fw6 ph0 mh0'>Register</legend>
              <div className='mt3'>
                <label className='db fw6 lh-copy f6' htmlFor='name'>
                  Name
                </label>
                <input
                  className='pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100'
                  type='text'
                  name='name'
                  id='name'
                  onInput={this.onNameChange}
                />
              </div>
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
                onClick={this.onSubmit}
                value='Register'
              />
            </div>
          </div>
        </main>
      </article>
    );
  }
}

export default Register;
