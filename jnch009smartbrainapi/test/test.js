const assert = require('assert');
const signin = require('../controllers/signin');
const jwt = require('jsonwebtoken');
const apiError = 'Internal Server error, please try again later';
const bcrypt = require('bcrypt');
const chai = require('chai');
const sinon = require('sinon');
const knex = require('knex');

const expect = chai.expect;

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'jnch009',
    password: process.env.DB_PASS,
    database: 'jnch009smartbrain',
  },
});

describe('Array', function () {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});

describe('/signin', function () {
  let req = { body: { email: '', password: '' } };
  let res = {
    cookie: sinon.spy(),
    json: sinon.spy(),
    status: function (resStatus) {
      expect(resStatus).to.equal(400);
      return this;
    },
  };

  it('sign in missing fields', function () {
    signin.handleSignIn(req, res, db, bcrypt, apiError, jwt);
  });

  it('sign in missing password', function () {
      req.body.email = 'test@gmail.com';
      req.body.password = 'test123';
      signin.handleSignIn(req, res, db, bcrypt, apiError, jwt);
  });
});
