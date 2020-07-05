import React from 'react';
import { render, screen } from '@testing-library/react';
import SignIn from '../Components/SignIn/SignIn';

const title = 'Sign In';

describe('renders SignIn component', () => {
  render(<SignIn />);

  it('Title exists', () => {
    expect(screen.getByText(title)).toBeInTheDocument();
  });
});
