const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const app = express();
const knex = require('knex');
require('dotenv').config();

const saltRounds = 10;
const apiError = 'Internal Server error, please try again later';

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'jnch009',
    password: process.env.DB_PASS,
    database: 'jnch009smartbrain',
  },
});

//Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  db.select('*')
    .from('users')
    .then(users => res.send(users))
    .catch(() => res.status(500).json(apiError));
});

app.post('/signin', (req, res) => {
  const { email, password } = req.body;

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
    .catch(() => res.status(500).json(apiError));
});

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
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
});

app.get('/profile/:userId', (req, res) => {
  const { userId } = req.params;
  db('users')
    .where('id', userId)
    .then(user => {
      user.length > 0
        ? res.json(user[0])
        : res.status(404).json('User not found');
    })
    .catch(() => res.status(500).json(apiError));
});

app.delete('/profile/:userId', (req, res) => {
  const { userId } = req.params;
  db('users')
    .where('id', userId)
    .del()
    .then(row => {
      row > 0
        ? res.json(`User successfully deleted`)
        : res.status(404).json('User not found');
    })
    .catch(() => res.status(500).json(apiError));
});

app.put('/image', (req, res) => {
  const { id } = req.body;
  db('users')
    .where({ id })
    .increment({
      score: 1,
    })
    .returning('score')
    .then(score => {
      score.length > 0
        ? res.json(score[0])
        : res.status(404).json('Cannot increment score on invalid user');
    })
    .catch(() => res.status(500).json(apiError));
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
});
