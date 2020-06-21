import React from 'react';

const ProfileDelete = () => {
  return (
    <>
      <main className='mw6 center profileContainer'>
        <h1 className='pa4'>Are you sure you want to delete your profile?</h1>
        <h4 className='pa2'>This is irreversible, be careful!</h4>
      </main>
      <button className='f6 link dim br-pill ph3 pv2 ma3 dib white bg-hot-pink w-25'>
        Yes
      </button>
      <button className='f6 link dim br-pill ph3 pv2 ma3 dib white bg-hot-pink w-25'>
        No
      </button>
    </>
  );
};

export default ProfileDelete;
