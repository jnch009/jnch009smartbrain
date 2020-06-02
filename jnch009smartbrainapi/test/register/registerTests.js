const {
  assert,
  chai,
  should,
  chaiHttp,
  knex,
  app,
  expect,
  beforeTest,
  afterTest,
} = require('../index');

module.exports = function RegisterTests() {
  const [email, password, name] = ['test4@gmail.com', 'testing12345', 'test4'];

  describe('register', function () {
    beforeEach(function (done) {
      beforeTest(done);
    });

    afterEach(function (done) {
      afterTest(done);
    });

    it('missing email', function (done) {
      chai
        .request(app)
        .post('/register')
        .send({
          password: password,
          name: name,
        })
        .end(function (err, res) {
          res.should.have.status(400);
          res.should.be.json;
          expect(res.body).to.equal('Cannot leave fields empty');
          done();
        });
    });

    it('missing password', function (done) {
      chai
        .request(app)
        .post('/register')
        .send({
          email: email,
          name: name,
        })
        .end(function (err, res) {
          res.should.have.status(400);
          res.should.be.json;
          expect(res.body).to.equal('Cannot leave fields empty');
          done();
        });
    });

    it('missing name', function (done) {
      chai
        .request(app)
        .post('/register')
        .send({
          email: email,
          password: password,
        })
        .end(function (err, res) {
          res.should.have.status(400);
          res.should.be.json;
          expect(res.body).to.equal('Cannot leave fields empty');
          done();
        });
    });

    it('duplicate email', function (done) {
      chai
        .request(app)
        .post('/register')
        .send({
          email: 'test3@gmail.com',
          name: name,
          password: password,
        })
        .end(function (err, res) {
          res.should.have.status(400);
          res.should.be.json;
          expect(res.body).to.equal('User not registered');
          done();
        });
    });

    it('successfully registered', function (done) {
      chai
        .request(app)
        .post('/register')
        .send({
          email: email,
          name: name,
          password: password,
        })
        .end(function (err, res) {
          res.should.have.status(200);
          res.should.be.json;
          expect(res).to.have.cookie('jwt');
          res.body.should.have.property('id');
          res.body.name.should.equal(4);
          done();
        });
    });
  });
};
