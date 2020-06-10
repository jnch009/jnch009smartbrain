import React, { useState } from 'react';
import { trackPromise } from 'react-promise-tracker';
import GridRow from '../GridRow/GridRow';
import './Profile.css';

const dateOptions = {
  year: 'numeric',
  day: 'numeric',
  month: 'long',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
};

const Profile = ({ profile, loadUser, setError, keyEnter }) => {
  const joinedDate = new Intl.DateTimeFormat('en-US', dateOptions).format(
    new Date(profile.joined)
  );

  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const joined = joinedDate;
  const [editProfile, setEditProfile] = useState(false);

  const { id, score } = profile;

  const editProfileEnterPress = e => {
    if (editProfile) {
      keyEnter(e, handleEditConfirmation);
    }
  };

  const handleEditConfirmation = () => {
    trackPromise(
      fetch(
        `${
          process.env.REACT_APP_FETCH_API || 'http://localhost:3000'
        }/profile/${profile.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            name: name,
            email: email,
          }),
        }
      )
        .then(res => res.json())
        .then(data => {
          if (data.id) {
            loadUser(data);
            setEditProfile(false);
          } else {
            setError(data);
          }
        })
        .catch(err => console.log(err))
    );
  };

  return (
    <>
      <div onKeyPress={e => editProfileEnterPress(e)} tabIndex='0'>
        <main class='mw6 center profileContainer'>
          <GridRow
            title='Name: '
            value={name}
            editable={editProfile}
            handleChange={setName}
          />
          <GridRow
            title='Email: '
            value={email}
            editable={editProfile}
            handleChange={setEmail}
          />
          <GridRow title='Score: ' value={score} />
          <GridRow title='Joined: ' value={joined} />
        </main>
        {editProfile ? (
          <a
            class='f6 link dim br-pill ph3 pv2 ma3 dib white bg-hot-pink'
            href={`/profile/${id}`}
            onClick={() => handleEditConfirmation(true)}
          >
            Finished Editing
          </a>
        ) : (
          <>
            <a
              class='f6 link dim br-pill ph3 pv2 ma3 dib white bg-hot-pink'
              href={`/profile/edit/${id}`}
              onClick={() => setEditProfile(true)}
            >
              Update Information
            </a>
            <a
              class='f6 link dim br-pill ph3 pv2 ma3 dib white bg-hot-pink'
              href='#0'
            >
              Update Password
            </a>
            <a
              class='f6 link dim br-pill ph3 pv2 ma3 dib white bg-hot-pink'
              href='#0'
            >
              Delete Account
            </a>
          </>
        )}
      </div>
    </>
  );
};

export default Profile;
