const {
  chai,
  app,
  expect,
  beforeTest,
  afterTest
} = require('../index');

/* eslint-disable no-undef */
module.exports = function SignOutTests() {
  const agent = chai.request.agent(app);
  describe('signout', function () {
    beforeEach(function (done) {
      beforeTest(done);
    });

    afterEach(function (done) {
      afterTest(done);
    });

    it('attempting to sign out when not signed in', function (done) {
      chai
        .request(app)
        .post('/signout')
        .end(function (err, res) {
          res.should.have.status(401);
          res.should.be.json;
          expect(res.body).to.equal('Unauthorized, please log in');
          done();
        });
    });

    it('signed out successfully', function () {
      return agent
        .post('/signin')
        .send({
          email: 'test1@gmail.com',
          password: process.env.TEST_PASS
        })
        .then(function (res) {
          expect(res).to.have.cookie('jwt');
          return agent.post('/signout').then(function (res) {
            res.should.have.status(200);
            res.should.be.json;
            expect(res.body).to.equal('Successfully signed out');
            expect(res).to.not.have.cookie('jwt');
            agent.close();
          });
        });
    });
  });
};
