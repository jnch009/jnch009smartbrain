const assert = require('assert');
const apiError = 'Internal Server error, please try again later';
const bcrypt = require('bcrypt');
const chai = require('chai');
const chaiHttp = require('chai-http');
const knex = require('knex');

const app = require('../server');

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

chai.use(chaiHttp);

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

  // let req = { body: { email: '', password: '' } };
  // let res = {
  //   cookie: sinon.spy(),
  //   json: sinon.spy(),
  //   status: function (resStatus) {
  //     return this;
  //   },
  // };

  it('get root', function (done) {
    chai
      .request(app)
      .get('/')
      .end(function (err, res) {
        //console.log(res.body);
        expect(res).to.have.status(401);
        expect(res.body).to.equal('Unauthorized, please log in');
        done();
      });
  });

  it('sign in missing fields', function (done) {
    chai
      .request(app)
      .post('/signin')
      .type('application/json')
      .send({
        email: '',
        password: '',
      })
      .end(function (err, res) {
        console.log(res.body);
        done();
      });

    // return new Promise((resolve) => {
    //   signin.handleSignIn(req, res, db, bcrypt, apiError, jwt);
    //   resolve();
    // })
    // signin.handleSignIn(req, res, db, bcrypt, apiError, jwt).then(console.log);
  });

  // it('sign in missing password', function () {
  //   req.body.email = 'test@gmail.com';
  //   req.body.password = 'test123';
  //   return new Promise(resolve => {
  //     signin.handleSignIn(req, res, db, bcrypt, apiError, jwt);
  //     resolve();
  //   });
  // });

  // it('signed in successfully', function () {
  //   req.body.email = testUser.email;
  //   req.body.password = testUser.password;

  //   return new Promise(resolve => {
  //     signin.handleSignIn(req, res, db, bcrypt, apiError, jwt);
  //     console.log(res.json.getCalls());
  //     resolve();
  //   });
  // });

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
