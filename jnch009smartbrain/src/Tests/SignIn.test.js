import React from 'react';
import { render, screen } from '@testing-library/react';
import SignIn from '../Components/SignIn/SignIn';

const title = 'Sign In';
const email = 'Email';
const password = 'Password';

describe('renders SignIn component', () => {
  //screen.debug();
  beforeEach(() => {
    render(<SignIn />);
  })


  it('Title exists', () => {
    expect(screen.getByText(title)).toBeInTheDocument();
  });

  it('Email label exists', () => {
    expect(screen.getByText(email)).toBeInTheDocument();
  });

  it('Password label exists', () => {
    expect(screen.getByLabelText(password)).toBeInTheDocument();
  });
});
