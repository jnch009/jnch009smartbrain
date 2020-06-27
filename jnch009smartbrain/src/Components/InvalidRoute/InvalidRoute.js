import React from 'react';

const InvalidRoute = ({ history }) => {
  const handleGoBack = () => {
    history.goBack();
  };

  return (
    <>
      <h1>404</h1>
      <h1>This page does not exist</h1>
      <p className='pointer dim' onClick={handleGoBack}>
        Click here to go back
      </p>
    </>
  );
};

export default InvalidRoute;
