import React from 'react';

const Navigation = ({ history, onRouteChange, isSignedIn }) => {
  console.log(history);
  return (
    <>
      {isSignedIn === true ? (
        <>
          <nav style={{ display: 'flex', justifyContent: 'flex-end' }}>
            {' '}
            <a
              href={`#/`}
              className='f3 link dim black underline pa3 pointer mv3'
            >
              Home
            </a>
            <a
              href={`#/Profile`}
              className='f3 link dim black underline pa3 pointer mv3'
            >
              Profile
            </a>
            <a
              href={`#/SignOut`}
              className='f3 link dim black underline pa3 pointer mv3'
            >
              Sign Out
            </a>
          </nav>
        </>
      ) : (
        <>
          <nav style={{ display: 'flex', justifyContent: 'flex-end' }}>
            {' '}
            <a
              href={`#/SignIn`}
              className='f3 link dim black underline pa3 pointer mv3'
            >
              Sign In
            </a>{' '}
            <a
              href={`#/Register`}
              className='f3 link dim black underline pa3 pointer mv3'
            >
              Register
            </a>
          </nav>
        </>
      )}
    </>
  );
};

export default Navigation;
