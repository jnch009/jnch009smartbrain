const assert = require('assert');
const signin = require('../controllers/signin');
const jwt = require('jsonwebtoken');
const apiError = 'Internal Server error, please try again later';
const bcrypt = require('bcrypt');
const chai = require('chai');
const sinon = require('sinon');
const knex = require('knex');
require('dotenv').config();

const expect = chai.expect;

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'jnch009',
    password: process.env.DB_PASS,
    database: 'jnch009smartbrain',
    pool: { min: 0 },
  },
});
const saltRounds = 10;
const testUser = {
  password: 'testing12345',
  name: 'jeremy',
  email: 'jeremy@gmail.com',
};

describe('Array', function () {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});

describe('/signin', function () {
  before(() => {
    return new Promise(resolve => {
      bcrypt.hash(testUser.password, saltRounds, function (err, hash) {
        if (err) {
          console.log(err);
        }

        db.transaction(trx => {
          trx
            .insert({
              hash: hash,
              email: testUser.email,
            })
            .into('login')
            .returning('email')
            .then(loginEmail => {
              return trx('users')
                .returning('*')
                .insert({
                  name: testUser.name,
                  email: loginEmail[0],
                  joined: new Date(),
                })
                .catch(() => res.status(400).json('User not registered'));
            })
            .then(trx.commit)
            .catch(trx.rollback);
        })
          .catch(() => res.status(500).json(apiError))
          .then(() => resolve());
      });
    });
  });

  let req = { body: { email: '', password: '' } };
  let res = {
    cookie: sinon.spy(),
    json: sinon.spy(),
    status: function (resStatus) {
      sinon.spy();
      return this;
    },
  };

  it('sign in missing fields', function () {
    signin.handleSignIn(req, res, db, bcrypt, apiError, jwt);
    console.log(res);
  });

  it('sign in missing password', function () {
    req.body.email = 'test@gmail.com';
    req.body.password = 'test123';
    signin.handleSignIn(req, res, db, bcrypt, apiError, jwt);
  });

  it('signed in successfully', function(){
    req.body.email = testUser.email;
    req.body.password = testUser.password;
    signin.handleSignIn(req, res, db, bcrypt, apiError, jwt);
  })

  after(() => {
    return new Promise((resolve, reject) =>
      db
        .transaction(trx => {
          trx('login')
            .where('email', testUser.email)
            .del()
            .then(() => {
              return trx('users').where('email', testUser.email).del();
            })
            .then(trx.commit)
            .catch(trx.rollback);
        })
        .then(() => {
          db.destroy();
          resolve();
        })
        .catch(err => reject(err)),
    );
  });
});
