import React from 'react';
import GridRow from '../GridRow/GridRow';

const ProfileEdit = ({
  editProfileEnterPress,
  handleEditConfirmation,
  setName,
  setEmail,
  routingLogic,
  name,
  email,
  score,
  joined,
}) => {
  return (
    <>
      <div onKeyPress={e => editProfileEnterPress(e)} tabIndex='0'>
        <main class='mw6 center profileContainer'>
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
          class='f6 link dim br-pill ph3 pv2 ma3 dib white bg-hot-pink'
          onClick={() => {
            handleEditConfirmation(true);
            routingLogic('/Profile');
          }}
        >
          Finished Editing
        </button>
      </div>
    </>
  );
};

export default ProfileEdit;
