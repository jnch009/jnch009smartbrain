import React from 'react';

const Navigation = ({ onRouteChange, isSignedIn }) => {
  return (
    <>
      {isSignedIn === true ? (
        <>
          <nav style={{ display: 'flex', justifyContent: 'flex-end' }}>
            {' '}
            <p
              className='f3 link dim black underline pa3 pointer'
              onClick={() => onRouteChange('/')}
            >
              Home
            </p>
            <p
              className='f3 link dim black underline pa3 pointer'
              onClick={() => onRouteChange('/Profile')}
            >
              Profile
            </p>
            <p
              className='f3 link dim black underline pa3 pointer'
              onClick={() => onRouteChange('/SignOut')}
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
              onClick={() => onRouteChange('/SignIn')}
            >
              Sign In
            </p>{' '}
            <p
              className='f3 link dim black underline pa3 pointer'
              onClick={() => onRouteChange('/Register')}
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
