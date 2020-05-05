import React from 'react';

import './FaceRecognition.css';

const FaceRecognition = ({ imageUrl, boundingBox }) => {
  return (
    <div className='center'>
      <div className='absolute mt2 mb4'>
        <img
          id='inputimage'
          className='center'
          src={imageUrl}
          alt=''
          width='500px'
          height='auto'
        />
        <div
          className='boundingBox'
          style={{
            top: boundingBox.topRow,
            right: boundingBox.rightCol,
            bottom: boundingBox.bottomRow,
            left: boundingBox.leftCol,
          }}
        ></div>
      </div>
    </div>
  );
};

export default FaceRecognition;
