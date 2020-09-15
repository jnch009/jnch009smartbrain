import React, {useState} from 'react';
import GridRow from '../GridRow/GridRow';
import {trackPromise} from 'react-promise-tracker';

const ProfilePassword = ({profile, history, setError, keyEnter}) => {
  const [currPassword, setCurrPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const passwordUpdateEnterPress = (e) => {
    keyEnter(e, handlePasswordUpdate);
  };

  // TODO: password must be at least 8 characters, /.{8,}/ Backend must be done as well
  const handlePasswordUpdate = () => {
    trackPromise(
      fetch(
        `${
          process.env.REACT_APP_FETCH_API || 'http://localhost:3000'
        }/profile/passwordUpdate/${profile.id}`,
        {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          credentials: 'include',
          body: JSON.stringify({
            password: newPassword,
            currentPassword: currPassword,
          }),
        },
      )
        .then((res) => res.json())
        .then((data) => {
          if (data === 'Password Updated') {
            // TODO: success message
            history.push('/Profile');
          } else {
            setError(data);
          }
        })
        .catch((err) => console.log(err)),
    );
  };

  return (
    <>
      <div onKeyPress={(e) => passwordUpdateEnterPress(e)} tabIndex='0'>
        <main className='mw6 center profileContainer'>
          <GridRow
            title='Current Password: '
            value={currPassword}
            editable
            password
            handleChange={setCurrPassword}
          />
          <GridRow
            title='New Password: '
            value={newPassword}
            editable
            password
            handleChange={setNewPassword}
          />
        </main>
        <button
          className='f6 link dim br-pill ph3 pv2 ma3 dib white bg-hot-pink w-25'
          onClick={() => {
            handlePasswordUpdate();
          }}
        >
          Update Password
        </button>
        <button
          className='f6 link dim br-pill ph3 pv2 ma3 dib white bg-hot-pink w-25'
          onClick={() => {
            history.push('/Profile');
          }}
        >
          Cancel
        </button>
      </div>
    </>
  );
};

export default ProfilePassword;
