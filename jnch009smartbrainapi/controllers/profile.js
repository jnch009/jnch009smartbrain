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

const handlePutProfile = (req, res, db, apiError) => {};

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

module.exports = {
  handleGetProfile,
  handleDeleteProfile,
};
