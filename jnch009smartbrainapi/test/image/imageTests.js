const {
  assert,
  chai,
  should,
  chaiHttp,
  knex,
  app,
  expect,
} = require('../index');

module.exports = function ImageTests() {
  const mockInput = 'akjhdfkjsldjfalksdfasdfjklasdf';
  const email = 'test3@gmail.com';
  const agent = chai.request.agent(app);

  describe('image', function () {
    describe('clarifai API call', function () {
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

      it('invalid input', function () {
        return agent
          .post('/signin')
          .send({
            email: email,
            password: process.env.TEST_PASS,
          })
          .then(function (res) {
            expect(res).to.have.cookie('jwt');
            return agent
              .post('/imageURL')
              .send({
                input: mockInput,
              })
              .then(function (res) {
                res.should.have.status(400);
                res.should.be.json;
                expect(res.body).to.equal(
                  'Please review your input or use another image',
                );
              })
          });
      });
    });

    describe('profile score update', function () {
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
                  'Cannot increment score on invalid user',
                );
              })
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
