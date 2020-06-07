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

module.exports = function ImageTests() {
  const mockInput = 'akjhdfkjsldjfalksdfasdfjklasdf';
  const email = 'test3@gmail.com';
  const agent = chai.request.agent(app);

  describe('image', function () {
    describe('clarifai API call', function () {
      beforeEach(function (done) {
        beforeTest(done);
      });

      afterEach(function (done) {
        afterTest(done);
      });

      it('invalid input', function (done) {
        agent
          .post('/signin')
          .send({
            email: email,
            password: process.env.TEST_PASS,
          })
          .then(function (res) {
            expect(res).to.have.cookie('jwt');
          })
          .then(function () {
            return agent.post('/imageURL').send({
              input: mockInput,
            });
          })
          .then(function (imageRes) {
            imageRes.should.have.status(400);
            imageRes.should.be.json;
            expect(imageRes.body).to.equal(
              'Please review your input or use another image'
            );
            done();
          })
          .catch(done);
      });
    });

    describe('profile score update', function () {
      beforeEach(function (done) {
        beforeTest(done);
      });

      afterEach(function (done) {
        afterTest(done);
      });

      it('update score on invalid user', function () {
        return agent
          .post('/signin')
          .send({
            email: email,
            password: process.env.TEST_PASS,
          })
          .then(function (res) {
            expect(res).to.have.cookie('jwt');
            return agent
              .put('/image')
              .send({
                id: 123,
              })
              .then(function (res) {
                res.should.have.status(404);
                res.should.be.json;
                expect(res.body).to.equal(
                  'Cannot increment score on invalid user'
                );
              });
          });
      });

      it('update score successfully', function () {
        return agent
          .post('/signin')
          .send({
            email: email,
            password: process.env.TEST_PASS,
          })
          .then(function (res) {
            expect(res).to.have.cookie('jwt');
            return agent
              .put('/image')
              .send({
                id: 3,
              })
              .then(function (res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.have.property('score');
                res.body.score.should.equal(1);
              })
              .finally(() => {
                agent.close();
              });
          });
      });
    });
  });
};
