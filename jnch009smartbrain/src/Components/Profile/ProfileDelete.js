import React from 'react';
import { trackPromise } from 'react-promise-tracker';

const ProfileDelete = ({ profile, history, clearUser, setError }) => {
  const handleProfileDelete = () => {
    trackPromise(
      fetch(
        `${
          process.env.REACT_APP_FETCH_API || 'http://localhost:3000'
        }/profile/${profile.id}`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        }
      )
        .then(res => res.json())
        .then(data => {
          if (data === 'User successfully deleted') {
            //TODO: success message
            clearUser();
          } else {
            setError(data);
          }
        })
        .catch(err => console.log(err))
    );
  };

  return (
    <>
      <main className='mw6 center profileContainer'>
        <h1 className='pa4'>Are you sure you want to delete your profile?</h1>
        <h4 className='pa2'>This is irreversible, be careful!</h4>
      </main>
      <button
        className='f6 link dim br-pill ph3 pv2 ma3 dib white bg-hot-pink w-25'
        onClick={() => handleProfileDelete()}
      >
        Yes
      </button>
      <button
        className='f6 link dim br-pill ph3 pv2 ma3 dib white bg-hot-pink w-25'
        onClick={() => history.push('/Profile')}
      >
        No
      </button>
    </>
  );
};

export default ProfileDelete;
