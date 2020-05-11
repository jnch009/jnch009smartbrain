import React from 'react';

const Rank = ({ name, score }) => {
  return (
    <div>
      <div className='white f3'>{`${name}, your current rank is....`}</div>
      <div className='white f1'>{`${score}`}</div>
    </div>
  );
};

export default Rank;
