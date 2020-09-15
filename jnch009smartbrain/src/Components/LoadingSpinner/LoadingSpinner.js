import React from 'react';
import {usePromiseTracker} from 'react-promise-tracker';

import './LoadingSpinner.css';

export const LoadingSpinner = (props) => {
  const {promiseInProgress} = usePromiseTracker();

  return (
    <>
      {promiseInProgress === true || props.route === '' ? (
        <div className='centeringUnknown'>
          <h1>LOADING</h1>
        </div>
      ) : null}
    </>
  );
};
