const handleRegister = (req, res, db, bcrypt, saltRounds, apiError) => {
  const { email, name, password } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json('Cannot leave fields empty');
  }

  bcrypt.hash(password, saltRounds, function (err, hash) {
    if (err) {
      console.log(err);
    }

    db.transaction(trx => {
      trx
        .insert({
          hash: hash,
          email: email,
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
          return trx('users')
            .returning('*')
            .insert({ name: name, email: loginEmail[0], joined: new Date() })
            .then(user => res.json(user[0]))
            .catch(() => res.status(400).json('User not registered'));
        })
        .then(trx.commit)
        .catch(trx.rollback);
    }).catch(() => res.status(500).json(apiError));
  });
};

module.exports = {
  handleRegister,
};
