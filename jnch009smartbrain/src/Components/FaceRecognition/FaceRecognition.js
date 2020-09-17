import React from 'react';

import './FaceRecognition.css';

const FaceRecognition = ({ imageUrl, boundingBox }) => {
  return (
    <div className='flexCenter'>
      <div className='absolute mt2 mb4'>
        <img
          id='inputimage'
          className='flexCenter'
          src={imageUrl}
          alt=''
          width='500px'
          height='auto'
        />
        {boundingBox.map(box => (
          <div
            key={box.topRow}
            className='boundingBox'
            style={{
              top: box.topRow,
              right: box.rightCol,
              bottom: box.bottomRow,
              left: box.leftCol
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default FaceRecognition;
