import React from 'react';
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
  routingLogic,
  loadUser,
  setError,
  keyEnter,
}) => {
  const joinedDate = new Intl.DateTimeFormat('en-US', dateOptions).format(
    new Date(profile.joined)
  );

  const { name, email, score } = profile;
  const joined = joinedDate;

  const profileView = (
    <>
      <main class='mw6 center profileContainer'>
        <GridRow title='Name: ' value={name} />
        <GridRow title='Email: ' value={email} />
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
    </>
  );

  const profileRouting = () => {
    switch (route) {
      case '/Profile/Edit':
        return (
          <ProfileEdit
            profile={profile}
            routingLogic={routingLogic}
            joined={joined}
            keyEnter={keyEnter}
            loadUser={loadUser}
            setError={setError}
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
