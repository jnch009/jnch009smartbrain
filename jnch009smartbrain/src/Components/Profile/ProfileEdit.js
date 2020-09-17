import React, { useState } from 'react';
import GridRow from '../GridRow/GridRow';
import { trackPromise } from 'react-promise-tracker';

const ProfileEdit = ({
  profile,
  history,
  joined,
  keyEnter,
  loadUser,
  setError
}) => {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);

  const { score } = profile;

  const editProfileEnterPress = e => {
    keyEnter(e, handleEditConfirmation);
  };

  // TODO: need to validate email, backend too.
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
            email: email
          })
        }
      )
        .then(res => res.json())
        .then(data => {
          if (data.id) {
            loadUser(data);
            history.push('/Profile');
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
        <main className='mw6 center profileContainer'>
          <GridRow
            title='Name: '
            value={name}
            editable
            handleChange={setName}
          />
          <GridRow
            title='Email: '
            value={email}
            editable
            handleChange={setEmail}
          />
          <GridRow title='Score: ' value={score} />
          <GridRow title='Joined: ' value={joined} />
        </main>
        <button
          className='f6 link dim br-pill ph3 pv2 ma3 dib white bg-hot-pink'
          onClick={() => {
            handleEditConfirmation(true);
            history.push('/Profile');
          }}
        >
          Finished Editing
        </button>
      </div>
    </>
  );
};

export default ProfileEdit;
