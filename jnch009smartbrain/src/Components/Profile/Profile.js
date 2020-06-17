import React, { useState } from 'react';
import { trackPromise } from 'react-promise-tracker';
import GridRow from '../GridRow/GridRow';
import ProfileEdit from './ProfileEdit';

import './Profile.css';

const dateOptions = {
  year: 'numeric',
  day: 'numeric',
  month: 'long',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
};

const Profile = ({
  profile,
  route,
  history,
  routingLogic,
  loadUser,
  setError,
  keyEnter,
}) => {
  const joinedDate = new Intl.DateTimeFormat('en-US', dateOptions).format(
    new Date(profile.joined)
  );

  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const joined = joinedDate;

  const { id, score } = profile;

  const profileView = (
    <>
      <div onKeyPress={e => editProfileEnterPress(e)} tabIndex='0'>
        <main class='mw6 center profileContainer'>
          <GridRow title='Name: ' value={name} handleChange={setName} />
          <GridRow title='Email: ' value={email} handleChange={setEmail} />
          <GridRow title='Score: ' value={score} />
          <GridRow title='Joined: ' value={joined} />
        </main>
        <>
          <button
            class='f6 link dim br-pill ph3 pv2 ma3 dib white bg-hot-pink'
            onClick={() => routingLogic('/Profile/Edit')}
          >
            Update Information
          </button>
          <button
            class='f6 link dim br-pill ph3 pv2 ma3 dib white bg-hot-pink'
            onClick={() => routingLogic('/Profile/PasswordChange')}
          >
            Update Password
          </button>
          <button
            class='f6 link dim br-pill ph3 pv2 ma3 dib white bg-hot-pink'
            onClick={() => routingLogic('/Profile/Delete')}
          >
            Delete Account
          </button>
        </>
      </div>
    </>
  );

  const editProfileEnterPress = e => {
    keyEnter(e, handleEditConfirmation);
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
          } else {
            setError(data);
          }
        })
        .catch(err => console.log(err))
    );
  };

  const profileRouting = () => {
    switch (route) {
      case '/Profile/Edit':
        return (
          <ProfileEdit
            editProfileEnterPress={editProfileEnterPress}
            handleEditConfirmation={handleEditConfirmation}
            setName={setName}
            setEmail={setEmail}
            routingLogic={routingLogic}
            name={name}
            email={email}
            score={score}
            joined={joined}
          />
        );
      case '/Profile/PasswordChange':
        break;
      case '/Profile/Delete':
        break;
      default:
        return profileView;
    }
  };

  return <>{profileRouting()}</>;
};

export default Profile;
