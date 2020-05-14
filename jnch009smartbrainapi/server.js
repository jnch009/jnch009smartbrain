const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const app = express();
const knex = require('knex');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const image = require('./controllers/image');
const root = require('./controllers/root');
const profile = require('./controllers/profile');

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

app.get('/', (req, res) => root.handleRoot(res, db, apiError));
app.post('/signin', (req, res) =>
  signin.handleSignIn(req, res, db, bcrypt, apiError),
);
app.post('/register', (req, res) =>
  //dependency injection
  register.handleRegister(req, res, db, bcrypt, saltRounds, apiError),
);

app.get('/profile/:email', (req, res) =>
  profile.handleGetProfile(req, res, db, apiError),
);

app.delete('/profile/:email', (req, res) =>
  profile.handleDeleteProfile(req, res, db, apiError),
);

app.put('/image', (req, res) =>
  image.handleImageUpdate(req, res, db, apiError),
);

app.post('/imageURL', (req, res) =>
  image.handleAPICall(req, res, process.env.REACT_APP_CLARIFAI_API),
);

app.listen(3000, () => {
  console.log('Listening on port 3000');
});
