import React from 'react';
import { usePromiseTracker } from 'react-promise-tracker';

export const LoadingSpinner = props => {
  const { promiseInProgress } = usePromiseTracker();

  return (
    <div>
      {promiseInProgress === true ? (
        <span className='centeringUnknown'>
          <h1>LOADING</h1>
        </span>
      ) : (
        <>{props.children}</>
      )}
    </div>
  );
};
