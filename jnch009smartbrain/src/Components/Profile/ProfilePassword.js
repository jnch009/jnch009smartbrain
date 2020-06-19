import React, { useState } from 'react';
import GridRow from '../GridRow/GridRow';
import { trackPromise } from 'react-promise-tracker';

const ProfilePassword = ({ profile, routingLogic, setError, keyEnter }) => {
  const [currPassword, setCurrPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const passwordUpdateEnterPress = e => {
    keyEnter(e, handlePasswordUpdate);
  };

  const handlePasswordUpdate = () => {
    trackPromise(
      fetch(
        `${
          process.env.REACT_APP_FETCH_API || 'http://localhost:3000'
        }/profile/passwordUpdate/${profile.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            password: newPassword,
            currentPassword: currPassword,
          }),
        }
      )
        .then(res => res.json())
        .then(data => {
          if (data === 'Password Updated') {
            //TODO: success message
            routingLogic('/Profile');
          } else {
            setError(data);
          }
        })
        .catch(err => console.log(err))
    );
  };

  return (
    <>
      <div onKeyPress={e => passwordUpdateEnterPress(e)} tabIndex='0'>
        <main class='mw6 center profileContainer'>
          <GridRow
            title='Current Password: '
            value={currPassword}
            editable
            handleChange={setCurrPassword}
          />
          <GridRow
            title='New Password: '
            value={newPassword}
            editable
            handleChange={setNewPassword}
          />
        </main>
        <button
          class='f6 link dim br-pill ph3 pv2 ma3 dib white bg-hot-pink'
          onClick={() => {
            handlePasswordUpdate();
          }}
        >
          Update Password
        </button>
        <button
          class='f6 link dim br-pill ph3 pv2 ma3 dib white bg-hot-pink'
          onClick={() => {
            routingLogic('/Profile');
          }}
        >
          Cancel
        </button>
      </div>
    </>
  );
};

export default ProfilePassword;
