const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const app = express();
const knex = require('knex');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const signout = require('./controllers/signout');
const image = require('./controllers/image');
const root = require('./controllers/root');
const profile = require('./controllers/profile');
require('dotenv').config();

const saltRounds = 10;
const apiError = 'Internal Server error, please try again later';
let db;

const nodeEnvironments = {
  production: knex({
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    }
  }),
  test: knex({
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      user: 'jnch009',
      password: process.env.DB_PASS,
      database: 'jnch009smartbraintest'
    }
  }),
  development: knex({
    client: 'pg',
    connection: {
      host: process.env.DB_HOST || '127.0.0.1',
      user: 'jnch009',
      password: process.env.DB_PASS,
      database: 'jnch009smartbrain'
    }
  })
};

db = nodeEnvironments[process.env.NODE_ENV] || nodeEnvironments['development'];

//Middleware
app.set('trust proxy',true);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());

const verifyJWT = (req, res, next) => {
  jwt.verify(req.cookies.jwt, process.env.JWT_SECRET, (err, decoded) => {
    if (decoded) {
      req.id = decoded.id;
      next();
    } else {
      res.status(401).json('Unauthorized, please log in');
    }
  });
};

const verifyConnectionString = (req, res, next) => {
  db.raw('SELECT 1').then(() => {
    next();
  }).catch(() => {
    res.status(500).json(apiError);
  })
}

app.get('/', verifyJWT, (req, res) => {
  root.handleRoot(req, res, apiError);
});

app.post('/signin', verifyConnectionString, (req, res) =>
  signin.handleSignIn(req, res, db, bcrypt, apiError, jwt)
);

app.post('/signout', verifyJWT, (req, res) => signout.handleSignOut(req, res));

app.post('/register', verifyConnectionString, (req, res) =>
  //dependency injection
  register.handleRegister(req, res, db, bcrypt, saltRounds, apiError, jwt)
);

app.get('/profile', verifyJWT, verifyConnectionString, (req, res) => {
  profile.handleGetProfileByJWT(req, res, db);
});

app.get('/profile/:id', verifyJWT, verifyConnectionString, (req, res) =>
  profile.handleGetProfile(req, res, db, apiError)
);

app.get('/allProfiles', verifyJWT, verifyConnectionString, (req, res) => {
  profile.handleAllProfiles(req, res, db, apiError);
});

app.put('/profile/:id', verifyJWT, verifyConnectionString, (req, res) => {
  profile.handlePutProfile(req, res, db, apiError);
});

app.put('/profile/passwordUpdate/:id', verifyJWT, verifyConnectionString, (req, res) => {
  profile.handlePutProfilePassword(req, res, db, bcrypt, saltRounds);
});

app.delete('/profile/:id', verifyJWT, verifyConnectionString, (req, res) =>
  profile.handleDeleteProfile(req, res, db)
);

app.delete('/purgeProfiles', verifyJWT, verifyConnectionString, (req, res) => {
  profile.handlePurgeProfiles(req, res, db, apiError);
});

app.put('/image', verifyJWT, verifyConnectionString, (req, res) =>
  image.handleImageUpdate(req, res, db, apiError)
);

app.post('/imageURL', verifyJWT, (req, res) =>
  image.handleAPICall(req, res, process.env.REACT_APP_CLARIFAI_API)
);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port ${process.env.PORT || 3000}`);
});

module.exports = app;
