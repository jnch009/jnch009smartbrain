import React from 'react';

const FaceRecognition = ({ imageUrl }) => {
  return (
    <div className='center'>
      <div className='absolute mt2 mb4'>
        <img className='center' src={imageUrl} alt='' width='300px' height='auto' />
      </div>
    </div>
  );
};

export default FaceRecognition;
