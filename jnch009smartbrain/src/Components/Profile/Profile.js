import React, { useState, useEffect } from 'react';
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

const article = (title, value) => (
  <article
    class='flex justify-around dt w-100 bb b--black-05 pa4 mt2'
    href='#0'
  >
    <div class='dtc v-mid pl3'>
      <h1 class='f4 f5-ns fw6 lh-title black mv0'>{title}</h1>
      <h2 class='f4 fw4 mt0 mb0 black-60'>{value}</h2>
    </div>
  </article>
);

// const editableArticle

const Profile = ({ profile }) => {
  const joinedDate = new Intl.DateTimeFormat('en-US', dateOptions).format(
    new Date(profile.joined),
  );

  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [score, setScore] = useState(profile.score);
  const [joined, setJoined] = useState(joinedDate);
  const [editProfile, setEditProfile] = useState(false);

  // useEffect(() => {
  //   trackPromise(
  //     fetch(`${process.env.REACT_APP_FETCH_API}/profile/${profileId}`, {
  //       credentials: 'include',
  //     })
  //       .then(resp => resp.json())
  //       .then(user => {
  //         if (user.id) {
  //           const joinedDate = new Intl.DateTimeFormat(
  //             'en-US',
  //             dateOptions,
  //           ).format(new Date(user.joined));

  //           setName(user.name);
  //           setEmail(user.email);
  //           setScore(user.score);
  //           setJoined(joinedDate);
  //         } else {
  //           onRouteChange('SignIn');
  //         }
  //       }),
  //   );
  // });

  const handleEditConfirmation = () => {
    console.log('confirmed!');
  };

  return (
    <>
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
          href='#0'
          onClick={() => handleEditConfirmation(true)}
        >Finished Editing</a>
      ) : (
        <>
          <a
            class='f6 link dim br-pill ph3 pv2 ma3 dib white bg-hot-pink'
            href='#0'
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
    </>
  );
};

export default Profile;
