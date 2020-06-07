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

  const userInfo = await db('users').where({ id });
  if (userInfo.length === 0) {
    return res.status(404).json('User to update not found');
  } else if (email === '' || name === '') {
    return res.status(400).json('Cannot leave fields blank');
  }

  await db
    .transaction(trx => {
      trx('users')
        .where({ id })
        .returning('*')
        .update({
          email: email !== undefined ? email : undefined,
          name: name !== undefined ? name : undefined,
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
    })
    .catch(() => res.status(500).json('DB Error'));
};

const handlePutProfilePassword = (req, res, db, bcrypt, saltRounds) => {
  const { id } = req.params;
  const { password } = req.body;

  if (!password) {
    res.status(400).json('Nothing to be updated');
  } else {
    let hashedPass = bcrypt.hashSync(password, saltRounds);

    db('login')
      .where({ id })
      .returning('*')
      .update({
        hash: hashedPass,
      })
      .then(user => {
        if (user.length > 0) {
          res.json('Password Updated');
        } else {
          res.status(404).json('User to update not found');
        }
      });
  }
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
              .then(() => res.json(`User successfully deleted`))
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
  handlePutProfilePassword,
};
