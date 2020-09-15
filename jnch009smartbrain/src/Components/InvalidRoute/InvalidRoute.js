import React from 'react';

const InvalidRoute = ({ history }) => {
  const handleGoBack = () => {
    history.goBack();
  };

  return (
    <>
      <h1>404</h1>
      <h1>Sorry guv'nor, but the princess is in another castle</h1>
      <p className='pointer dim' onClick={handleGoBack}>
        Click here to go back
      </p>
    </>
  );
};

export default InvalidRoute;
