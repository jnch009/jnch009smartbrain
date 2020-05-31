import React from 'react';
import './Profile.css';

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

const Profile = () => {
  return (
    <>
      <main class='mw6 center profileContainer'>
        {article('Name: ', 'Jeremy Ng')}
        {article('Email: ', 'jngchenghin@gmail.com')}
        {article('Score: ', 0)}
        {article('Joined: ', Date.now())}
      </main>
      <a
        class='f6 link dim br-pill ph3 pv2 ma3 dib white bg-hot-pink'
        href='#0'
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
  );
};

export default Profile;
