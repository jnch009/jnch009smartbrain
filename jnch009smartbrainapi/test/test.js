require('dotenv').config();
process.env.NODE_ENV = 'test';

const assert = require('assert');
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const knex = require('../db/knex');
const app = require('../server');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Array', function () {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});

describe('signin', function () {
  beforeEach(function (done) {
    knex.migrate.rollback().then(function () {
      knex.migrate.latest().then(function () {
        return knex.seed.run().then(function () {
          done();
        });
      });
    });
  });

  afterEach(function (done) {
    knex.migrate.rollback().then(function () {
      done();
    });
  });

  it('email missing', function (done) {
    chai
      .request(app)
      .post('/signin')
      .end(function (err, res) {
        res.should.have.status(400);
        res.should.be.json;
        expect(res.body).to.equal('Cannot leave fields empty');
        done();
      });
  });

  it('password missing', function (done) {
    chai
      .request(app)
      .post('/signin')
      .end(function (err, res) {
        res.should.have.status(400);
        res.should.be.json;
        expect(res.body).to.equal('Cannot leave fields empty');
        done();
      });
  });

  it('incorrect credentials', function (done) {
    chai
      .request(app)
      .post('/signin')
      .send({
        email: 'test1@gmail.com',
        password: 'yoyoyoma',
      })
      .end(function (err, res) {
        res.should.have.status(401);
        res.should.be.json;
        expect(res.body).to.equal('access denied');
        done();
      });
  });

  it('signed in successfully', function (done) {
    chai
      .request(app)
      .post('/signin')
      .send({
        email: 'test1@gmail.com',
        password: process.env.TEST_PASS,
      })
      .end(function (err, res) {
        res.should.have.status(200);
        res.should.be.json;
        expect(res).to.have.cookie('jwt');
        res.body.should.have.property('name');
        res.body.name.should.equal('test1');
        res.body.should.have.property('email');
        res.body.email.should.equal('test1@gmail.com');
        res.body.should.have.property('score');
        res.body.score.should.equal(0);
        done();
      });
  });
});

//nest describe blocks to have certain tests with and without auth
describe('root', function () {
  it('get root without auth', function (done) {
    chai
      .request(app)
      .get('/')
      .end(function (err, res) {
        expect(res).to.have.status(401);
        expect(res.body).to.equal('Unauthorized, please log in');
        done();
      });
  });

  describe('root route with auth', function () {
    beforeEach(function (done) {
      knex.migrate.rollback().then(function () {
        knex.migrate.latest().then(function () {
          return knex.seed.run().then(function () {
            done();
          });
        });
      });
    });

    afterEach(function (done) {
      knex.migrate.rollback().then(function () {
        done();
      });
    });
    
    it('get root with auth', function(done){
      let agent = chai.request.agent(app);
      agent.post('/signin').send({
        email: 'test1@gmail.com',
        password: process.env.TEST_PASS,
      }).then(function(res){
        expect(res).to.have.cookie('jwt')
        return agent.get('/').then(function(res){
          expect(res).to.have.status(200);
          agent.close();
          done();
        })
      });
    })
  });
});
