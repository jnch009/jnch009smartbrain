const {
  assert,
  chai,
  should,
  chaiHttp,
  knex,
  app,
  expect,
  bcrypt,
} = require('../index');

module.exports = function ProfileTests() {
  const [email, name] = ['test3@gmail.com', 'test3'];
  const hashedPassword = bcrypt.hashSync(process.env.TEST_PASS, 10);
  const [updatedEmail, updatedPassword, updatedName] = [
    'testJeremy@gmail.com',
    'jsdkfljaskdljf!@!@!@',
    'Jeremy',
  ];

  describe('profile', function () {
    describe('get profile', function () {
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

      it('cannot get user', function (done) {
        let agent = chai.request.agent(app);

        agent
          .post('/signin')
          .send({
            email: email,
            password: process.env.TEST_PASS,
          })
          .then(function (res) {
            expect(res).to.have.cookie('jwt');
            return agent.get('/profile').then(function (res) {
              res.should.have.status(404);
              res.should.be.json;
              expect(res.body).to.equal('User not found');
              agent.close();
              done();
            });
          });
      });

      it('success getting user', function (done) {
        let agent = chai.request.agent(app);

        agent
          .post('/signin')
          .send({
            email: email,
            password: process.env.TEST_PASS,
          })
          .then(function (res) {
            expect(res).to.have.cookie('jwt');
            return agent
              .get(`/profile/${email}`)
              .then(function (res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.have.property('name');
                res.body.name.should.equal(name);
                res.body.should.have.property('email');
                res.body.email.should.equal(email);
                res.body.should.have.property('score');
                res.body.score.should.equal(0);
                res.body.should.have.property('joined');
                agent.close();
                done();
              });
          });
      });
    });
    
    describe('update profile', function () {
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

      it('cannot find user to update', function (done) {
        chai
          .request(app)
          .put('/profile')
          .end(function (err, res) {
            res.should.have.status(404);
            res.should.be.json;
            expect(res.body).to.equal('User not found');
            done();
          });
      });

      it('success updating user email', function (done) {
        let agent = chai.request.agent(app);
        chai
          .request(app)
          .put('/profile')
          .send({
            email: email,
            updatedData: {
              email: updatedEmail,
            },
          })
          .end(function (err, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.have.property('email');
            res.body.email.should.equal(updatedEmail);
            done();
          });
      });
    });
  });
};
