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

// no need to do .json since we're not sending by HTTP
// db.select('*')
//   .from('users')
//   .then(data => console.log(data));

//Helpers
const filterUserById = userId => db.users.filter(user => user.id === userId);
const filterUserByCredentials = (email, password) =>
  db.users.filter(user => user.email === email && user.password === password);

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
  // Load hash from your password DB.
  // bcrypt.compare(
  //   'jeremypassword12356',
  //   '$2b$10$TgAkMDWlnrWaazqMehN.y.8ANsr2JczYXGFECvYiJxClIXwMuNjda',
  //   function (err, result) {
  //     console.log('first guess ',result);
  //   },
  // );

  // bcrypt.compare(
  //   'jer',
  //   '$2b$10$TgAkMDWlnrWaazqMehN.y.8ANsr2JczYXGFECvYiJxClIXwMuNjda',
  //   function (err, result) {
  //     console.log('second guess ', result);
  //   },
  // );

  let { email, password } = req.body;
  let signin = filterUserByCredentials(email, password);
  signin.length === 1
    ? res.json(signin[0])
    : res.status(401).json('Unauthorized');
});

app.post('/register', (req, res) => {
  const { email, name } = req.body;
  // bcrypt.hash(password, saltRounds, function (err, hash) {
  //   // Store hash in your password DB.
  //   if (err) {
  //     console.log(err);
  //   }

  //   console.log(hash);
  // });

  db('users')
    // returning everything
    .returning('*')
    .insert({ name: name, email: email, joined: new Date() })
    .then(user => res.json(user[0]))
    .catch(() => res.status(400).json('User not registered'));
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

app.put('/image', (req, res) => {
  const { userId } = req.body;
  let user = filterUserById(userId);

  if (user.length === 1) {
    user[0].score += 1;
    res.json(user[0]);
  } else {
    res.status(404).json('cannot find user to update');
  }
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
});
