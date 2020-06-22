import React from 'react';

const Navigation = ({ history, onRouteChange, isSignedIn }) => {
  return (
    <>
      {isSignedIn === true ? (
        <>
          <nav style={{ display: 'flex', justifyContent: 'flex-end' }}>
            {' '}
            <p
              className='f3 link dim black underline pa3 pointer'
              onClick={() => history.push('/')}
            >
              Home
            </p>
            <p
              className='f3 link dim black underline pa3 pointer'
              onClick={() => history.push('/Profile')}
            >
              Profile
            </p>
            <p className='f3 link dim black underline pa3 pointer'>Sign Out</p>
          </nav>
        </>
      ) : (
        <>
          <nav style={{ display: 'flex', justifyContent: 'flex-end' }}>
            {' '}
            <p
              className='f3 link dim black underline pa3 pointer'
              onClick={() => {
                onRouteChange('/SignIn');
                history.push('/SignIn');
              }}
            >
              Sign In
            </p>{' '}
            <p
              className='f3 link dim black underline pa3 pointer'
              onClick={() => {
                onRouteChange('/Register');
                history.push('/Register');
              }}
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
