import React from 'react';
import GridRow from '../GridRow/GridRow';
import ProfileEdit from './ProfileEdit';
import ProfilePassword from './ProfilePassword';
import ProfileDelete from './ProfileDelete';

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
  clearUser,
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
          class='f6 link dim br-pill ph3 pv2 ma3 dib white bg-hot-pink w5'
          onClick={() => routingLogic('/Profile/Edit')}
        >
          Update Information
        </button>
        <button
          class='f6 link dim br-pill ph3 pv2 ma3 dib white bg-hot-pink w5'
          onClick={() => routingLogic('/Profile/PasswordChange')}
        >
          Update Password
        </button>
        <button
          class='f6 link dim br-pill ph3 pv2 ma3 dib white bg-hot-pink w5'
          onClick={() => routingLogic('/Profile/Delete')}
        >
          Delete Account
        </button>
      </>
    </>
  );

  const editProps = {
    profile,
    routingLogic,
    joined,
    keyEnter,
    loadUser,
    setError,
  };

  const passUpdateProps = {
    profile,
    routingLogic,
    keyEnter,
    setError,
  };

  const deleteProps = {
    profile,
    routingLogic,
    clearUser,
    setError,
  };

  const profileRouting = () => {
    switch (route) {
      case '/Profile/Edit':
        return <ProfileEdit {...editProps} />;
      case '/Profile/PasswordChange':
        return <ProfilePassword {...passUpdateProps} />;
      case '/Profile/Delete':
        return <ProfileDelete {...deleteProps} />;
      default:
        return profileView;
    }
  };

  return <>{profileRouting()}</>;
};

export default Profile;
