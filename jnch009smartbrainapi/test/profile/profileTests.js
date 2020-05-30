const {
  assert,
  chai,
  should,
  chaiHttp,
  knex,
  app,
  expect,
} = require('../index');

module.exports = function ProfileTests() {
  const [id, email, name] = [3,'test3@gmail.com', 'test3'];
  const [updatedEmail, updatedPassword, updatedName] = [
    'testJeremy@gmail.com',
    'jsdkfljaskdljf!@!@!@',
    'Jeremy',
  ];
  const agent = chai.request.agent(app);

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
        agent
          .post('/signin')
          .send({
            email: email,
            password: process.env.TEST_PASS,
          })
          .then(function (res) {
            expect(res).to.have.cookie('jwt');
            return agent.get('/profile/156161').then(function (res) {
              res.should.have.status(404);
              res.should.be.json;
              expect(res.body).to.equal('User not found');
            });
          })
          .catch(err => console.log(err.message))
          .finally(() => {
            done();
          });
      });

      it('success getting user', function (done) {
        agent
          .post('/signin')
          .send({
            email: email,
            password: process.env.TEST_PASS,
          })
          .then(function (res) {
            expect(res).to.have.cookie('jwt');
            return agent.get(`/profile/${id}`).then(function (res) {
              res.should.have.status(200);
              res.should.be.json;
              res.body.should.have.property('name');
              res.body.name.should.equal(name);
              res.body.should.have.property('email');
              res.body.email.should.equal(email);
              res.body.should.have.property('score');
              res.body.score.should.equal(0);
              res.body.should.have.property('joined');
            });
          })
          .catch(err => console.log(err.message))
          .finally(() => {
            done();
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

      it('cannot update user', function (done) {
        agent
          .post('/signin')
          .send({
            email: email,
            password: process.env.TEST_PASS,
          })
          .then(function (res) {
            expect(res).to.have.cookie('jwt');
            return agent.put('/profile/156161').then(function (res) {
              res.should.have.status(404);
              res.should.be.json;
              expect(res.body).to.equal('User not found');
            });
          })
          .catch(err => console.log(err.message))
          .finally(() => {
            done();
          });
      });

      it('success updating email', function (done) {
        agent
          .post('/signin')
          .send({
            email: email,
            password: process.env.TEST_PASS,
          })
          .then(function (res) {
            expect(res).to.have.cookie('jwt');
            return agent
              .put(`/profile/${id}`)
              .send({
                email: updatedEmail,
              })
              .then(function (res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.have.property('email');
                res.body.email.should.equal(updatedEmail);
              })
              .catch(err => console.log(err.message))
              .finally(() => {
                done();
              });
          });
      });

      it('success updating multiple (username and email)', function (done) {
        agent
          .post('/signin')
          .send({
            email: email,
            password: process.env.TEST_PASS,
          })
          .then(function (res) {
            expect(res).to.have.cookie('jwt');
            return agent
              .put(`/profile/${id}`)
              .send({
                email: updatedEmail,
                name: updatedName,
              })
              .then(function (res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.have.property('email');
                res.body.email.should.equal(updatedEmail);
                res.body.should.have.property('name');
                res.body.name.should.equal(updatedName);
              })
              .catch(err => console.log(err.message))
              .finally(() => {
                //agent.close();
                done();
              });
          });
      });

      describe('password update', function () {
        before(function (done) {
          knex.migrate.rollback().then(function () {
            knex.migrate.latest().then(function () {
              return knex.seed.run().then(function () {
                done();
              });
            });
          });
        });

        after(function (done) {
          knex.migrate.rollback().then(function () {
            done();
          });
        });

        it('success updating password', function (done) {
          agent
            .post('/signin')
            .send({
              email: email,
              password: process.env.TEST_PASS,
            })
            .then(function (res) {
              expect(res).to.have.cookie('jwt');
              return agent
                .put(`/profile/passwordUpdate/${id}`)
                .send({
                  password: updatedPassword,
                })
                .then(function (res) {
                  res.should.have.status(200);
                  res.should.be.json;
                  expect(res.body).to.equal('Password Updated');
                })
                .catch(err => console.log(err.message))
                .finally(() => {
                  done();
                });
            });
        });

        it('verify sign in with new password', function (done) {
          agent
            .post('/signin')
            .send({
              email: email,
              password: updatedPassword,
            })
            .then(function (res) {
              expect(res).to.have.cookie('jwt');
            })
            .catch(err => console.log(err.message))
            .finally(() => {
              done();
            });
        });
      });
    });

    describe('delete profile', function () {
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

      it('cannot delete user', function (done) {
        agent
          .post('/signin')
          .send({
            email: email,
            password: process.env.TEST_PASS,
          })
          .then(function (res) {
            expect(res).to.have.cookie('jwt');
            return agent.get('/profile/156161').then(function (res) {
              res.should.have.status(404);
              res.should.be.json;
              expect(res.body).to.equal('User not found');
            });
          })
          .catch(err => console.log(err.message))
          .finally(() => {
            done();
          });
      });

      it('success deleting account', function (done) {
        agent
          .post('/signin')
          .send({
            email: email,
            password: process.env.TEST_PASS,
          })
          .then(function (res) {
            expect(res).to.have.cookie('jwt');
            return agent
              .delete(`/profile/${id}`)
              .then(function (res) {
                res.should.have.status(200);
                res.should.be.json;
                expect(res.body).to.equal(`User successfully deleted`);
              })
              .catch(err => console.log(err.message))
              .finally(() => {
                agent.close();
                done();
              });
          });
      });
    });
  });
};
