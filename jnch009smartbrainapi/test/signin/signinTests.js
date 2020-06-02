const {
  assert,
  chai,
  should,
  chaiHttp,
  knex,
  app,
  expect,
  beforeTest,
  afterTest
} = require('../index');

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
          res.body.should.have.property('id');
          res.body.name.should.equal('1');
          done();
        });
    });
  });
};
