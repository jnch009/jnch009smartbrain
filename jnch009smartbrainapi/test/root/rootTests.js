const {
  assert,
  chai,
  should,
  chaiHttp,
  knex,
  app,
  expect,
} = require('../index');

//nest describe blocks to have certain tests with and without auth
module.exports = function RootTests() {
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

      it('get root with auth', function (done) {
        let agent = chai.request.agent(app);
        agent
          .post('/signin')
          .send({
            email: 'test1@gmail.com',
            password: process.env.TEST_PASS,
          })
          .then(function (res) {
            expect(res).to.have.cookie('jwt');
            return agent.get('/').then(function (res) {
              expect(res).to.have.status(200);
              agent.close();
              done();
            });
          });
      });
    });
  });
};
