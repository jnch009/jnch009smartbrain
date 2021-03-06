const {
  chai,
  app,
  expect,
  beforeTest,
  afterTest
} = require('../index');

/* eslint-disable no-undef */
module.exports = function SignInTests() {
  describe('signin', function () {
    beforeEach(function (done) {
      beforeTest(done);
    });

    afterEach(function (done) {
      afterTest(done);
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
          password: 'yoyoyoma'
        })
        .end(function (err, res) {
          res.should.have.status(401);
          res.should.be.json;
          expect(res.body).to.equal('Access Denied');
          done();
        });
    });

    it('signed in successfully', function (done) {
      chai
        .request(app)
        .post('/signin')
        .send({
          email: 'test1@gmail.com',
          password: process.env.TEST_PASS
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
          res.body.should.have.property('joined');
          done();
        });
    });
  });
};
