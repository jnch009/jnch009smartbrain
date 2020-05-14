const handleSignIn = (req, res, db, bcrypt, apiError) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json('Cannot leave fields empty');
  }

  //Transaction is NOT required here, because you are retrieving items
  //You are NOT modifying the database directly
  db('login')
    .select('hash')
    .where({ email: email })
    .then(dbPass => {
      bcrypt.compare(password, dbPass[0].hash, (err, result) => {
        if (err) {
          console.log(err);
        }

        if (result) {
          return db('users')
            .select('*')
            .where({ email })
            .then(user => res.json(user[0]))
            .catch(() => res.status(400).json('User not found'));
        }
        return res.status(401).json('access denied');
      });
    })
    .catch(() => res.status(404).json(apiError));
};

module.exports = {
  handleSignIn,
};
