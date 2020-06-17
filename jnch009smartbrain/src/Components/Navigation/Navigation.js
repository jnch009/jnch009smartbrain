import React from 'react';

const Navigation = ({ routingLogic, isSignedIn }) => {
  return (
    <>
      {isSignedIn === true ? (
        <>
          <nav style={{ display: 'flex', justifyContent: 'flex-end' }}>
            {' '}
            <p
              className='f3 link dim black underline pa3 pointer'
              onClick={() => routingLogic('/')}
            >
              Home
            </p>
            <p
              className='f3 link dim black underline pa3 pointer'
              onClick={() => routingLogic('/Profile')}
            >
              Profile
            </p>
            <p
              className='f3 link dim black underline pa3 pointer'
              onClick={() => routingLogic('/SignOut')}
            >
              Sign Out
            </p>
          </nav>
        </>
      ) : (
        <>
          <nav style={{ display: 'flex', justifyContent: 'flex-end' }}>
            {' '}
            <p
              className='f3 link dim black underline pa3 pointer'
              onClick={() => routingLogic('/SignIn')}
            >
              Sign In
            </p>{' '}
            <p
              className='f3 link dim black underline pa3 pointer'
              onClick={() => routingLogic('/Register')}
            >
              Register
            </p>
          </nav>
        </>
      )}
    </>
  );
};

export default Navigation;
