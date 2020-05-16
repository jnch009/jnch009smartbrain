import React from 'react';
import {usePromiseTracker} from 'react-promise-tracker';

export const LoadingSpinner = (props) => {
  const {promiseInProgress} = usePromiseTracker();

  return (
    <div>
      {promiseInProgress === true || props.route === '' ? (
        <span className='centeringUnknown'>
          <h1>LOADING</h1>
        </span>
      ) : null}
    </div>
  );
};
