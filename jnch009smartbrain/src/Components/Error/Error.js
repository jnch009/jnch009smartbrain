import React from 'react';
import './Error.css';

const Error = props => {
  return (
    <label className='br4 pa3 bg-red z-1 absolute parentWidth dib center left-0 right-0 w-50 top-2'>
      <h1 className='mv0'>ALERT!</h1>
      <br />
      {props.children}
    </label>
  );
};

export default Error;
