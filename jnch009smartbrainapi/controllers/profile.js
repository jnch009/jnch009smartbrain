const handleGetProfileByJWT = (req, res, db) => {
  db('users')
    .where({ id: req.user.id })
    .then(user => {
      user.length > 0
        ? res.json(user[0])
        : res.status(404).json('User not found');
    })
    .catch(() => res.status(500).json(apiError));
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

const handlePutProfile = (req, res, db) => {
  const { id } = req.params;
  const { email, name } = req.body;

  if (!email && !name) {
    res.status(400).json('Nothing to be updated');
  } else {
    db('users')
      .where({ id })
      .returning('*')
      .update({
        email: email !== undefined ? email : undefined,
        name: name !== undefined ? name : undefined,
      })
      .then(user => {
        user.length > 0
          ? res.json(user[0])
          : res.status(404).json('User to update not found');
      });
  }
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
