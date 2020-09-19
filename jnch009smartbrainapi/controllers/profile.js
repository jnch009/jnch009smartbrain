const handleGetProfileByJWT = (req, res, db) => {
  db('users')
    .where({ id: req.id })
    .then(user => {
      user.length > 0
        ? res.json(user[0])
        : res.status(404).json('User not found');
    })
    .catch(() => res.status(404).json('User not found'));
};

const handleGetProfile = (req, res, db, apiError) => {
  const { id } = req.params;
  db('users')
    .where({ id })
    .then(user => {
      user.length > 0
        ? res.json(user[0])
        : res.status(404).json('User not found');
    })
    .catch(() => res.status(500).json(apiError));
};

const handlePutProfile = async (req, res, db) => {
  const { id } = req.params;
  const { email, name } = req.body;

  //Promise way
  db('users')
    .where({ id })
    .then(userInfo => {
      if (userInfo.length === 0) {
        res.status(404).json('User to update not found');
        throw 'User to update not found';
      } else if (email === '' || name === '') {
        res.status(400).json('Cannot leave fields blank');
        throw 'Cannot leave fields blank';
      }
    })
    .then(() => {
      db.transaction(trx => {
        trx('users')
          .where({ id })
          .returning('*')
          .update({
            email: email !== undefined ? email : undefined,
            name: name !== undefined ? name : undefined
          })
          .then(update => {
            return update[0].email !== undefined
              ? trx('login')
                .where({ id })
                .update({ email: update[0].email })
                .then(() => {
                  res.json(update[0]);
                })
              : res.status(400).json('Failed to update user');
          })
          .then(trx.commit)
          .catch(trx.rollback);
      }).catch(() => res.status(500).json('DB Error'));
    })
    .catch(err => err);

  //Async await way
  // const userInfo = await db('users').where({ id });
  // if (userInfo.length === 0) {
  //   return res.status(404).json('User to update not found');
  // } else if (email === '' || name === '') {
  //   return res.status(400).json('Cannot leave fields blank');
  // }

  // await db
  //   .transaction(trx => {
  //     trx('users')
  //       .where({ id })
  //       .returning('*')
  //       .update({
  //         email: email !== undefined ? email : undefined,
  //         name: name !== undefined ? name : undefined,
  //       })
  //       .then(update => {
  //         return update[0].email !== undefined
  //           ? trx('login')
  //               .where({ id })
  //               .update({ email: update[0].email })
  //               .then(() => {
  //                 res.json(update[0]);
  //               })
  //           : res.status(400).json('Failed to update user');
  //       })
  //       .then(trx.commit)
  //       .catch(trx.rollback);
  //   })
  //   .catch(() => res.status(500).json('DB Error'));
};

const handlePutProfilePassword = (req, res, db, bcrypt, saltRounds) => {
  const { id } = req.params;
  const { password, currentPassword } = req.body;

  if (!password) {
    res.status(400).json('Nothing to be updated');
  }

  //Promise way
  db('login')
    .where({ id })
    .then(currentUser => {
      if (currentUser.length === 0) {
        res.status(404).json('User to update not found');
        throw 'User to update not found';
      } else if (!bcrypt.compareSync(currentPassword, currentUser[0].hash)) {
        res.status(400).json('Current password is incorrect');
        throw 'Current password is incorrect';
      }
    })
    .then(() => {
      let hashedPass = bcrypt.hashSync(password, saltRounds);
      db('login')
        .where({ id })
        .returning('*')
        .update({ hash: hashedPass })
        .then(updateUser => {
          if (updateUser.length > 0) {
            res.json('Password Updated');
          } else {
            res.status(400).json('Password not updated');
          }
        });
    })
    .catch(err => err);

  // Async Await way
  // const currentUser = await db('login').where({ id });
  // if (currentUser.length === 0) {
  //   res.status(404).json('User to update not found');
  // } else if (!bcrypt.compareSync(currentPassword, currentUser[0].hash)) {
  //   res.status(400).json('Current password is incorrect');
  // } else {
  //   let hashedPass = bcrypt.hashSync(password, saltRounds);
  //   const updateUser = await db('login').where({ id }).returning('*').update({
  //     hash: hashedPass,
  //   });

  //   if (updateUser.length > 0) {
  //     res.json('Password Updated');
  //   } else {
  //     res.status(400).json('Password not updated');
  //   }
  // }
};

const handleDeleteProfile = (req, res, db, apiError) => {
  const { id } = req.params;

  db.transaction(trx => {
    trx('users')
      .where({ id })
      .del()
      .then(row => {
        return row > 0
          ? trx('login')
            .where({ id })
            .del()
            .then(() => res.json('User successfully deleted'))
          : res.status(404).json('User not found');
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch(() => res.status(500).json(apiError));
};

const handleAllProfiles = (req, res, db, apiError) => {
  db('users')
    .then(profiles => res.json(profiles))
    .catch(() => res.status(500).json(apiError));
};

const handlePurgeProfiles = (req, res, db, apiError) => {
  db.transaction(trx => {
    trx('users')
      .del()
      .then(trx('login').del().then(res.json('All profiles deleted!')))
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch(() => res.status(500).json(apiError));
};

module.exports = {
  handleGetProfile,
  handleGetProfileByJWT,
  handleDeleteProfile,
  handleAllProfiles,
  handlePurgeProfiles,
  handlePutProfile,
  handlePutProfilePassword
};
