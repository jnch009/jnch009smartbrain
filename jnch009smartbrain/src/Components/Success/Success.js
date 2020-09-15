import React from 'react';

const Success = (props) => {
  return (
    <label className='br4 pa3 bg-green z-1 absolute dib center flex-column left-0 right-0 w-50 top-2'>
      <h1 className='mv0'>Success!</h1>
      <br />
      {props.children}
    </label>
  );
};

export default Success;
