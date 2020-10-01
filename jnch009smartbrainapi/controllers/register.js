const handleRegister = (req, res, db, bcrypt, saltRounds, apiError, jwt) => {
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
          email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
          return trx('users')
            .returning('*')
            .insert({ name: name, email: loginEmail[0], joined: new Date() })
            .then(user => {
              const token = jwt.sign(
                { id: user[0].id },
                process.env.JWT_SECRET,
                {
                  expiresIn: '1h'
                }
              );
              res
                .cookie('jwt', token, {
                  httpOnly: true,
                  sameSite:
                    process.env.NODE_ENV === 'production' ? 'none' : false,
                  secure: process.env.NODE_ENV === 'production' ? true : false,
                  expires: new Date(Date.now() + 3.6e6)
                })
                .json(user[0]);
            })
            .catch(() => {
              throw 'Issues with Registration';
            });
        })
        .then(trx.commit)
        .catch(err => {
          trx.rollback;
          res.status(400).json(err);
        });
    }).catch(() => res.status(500).json(apiError));
  });
};

module.exports = {
  handleRegister
};
