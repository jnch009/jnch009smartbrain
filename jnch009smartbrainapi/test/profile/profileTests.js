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
  const [id, email, name] = [3, 'test3@gmail.com', 'test3'];
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

      it('cannot get user', function () {
        return agent
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
      });

      it('success getting user', function () {
        return agent
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
      });

      it('success getting all users', function () {
        return agent
          .post('/signin')
          .send({
            email: email,
            password: process.env.TEST_PASS,
          })
          .then(function (res) {
            expect(res).to.have.cookie('jwt');
            return agent.get(`/allProfiles`).then(function (res) {
              res.should.have.status(200);
              res.should.be.json;
              res.body.should.have.length(3);
            });
          })
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

      it('cannot update user', function () {
        return agent
          .post('/signin')
          .send({
            email: email,
            password: process.env.TEST_PASS,
          })
          .then(function (res) {
            expect(res).to.have.cookie('jwt');
            return agent
              .put('/profile/156161')
              .send({
                email: updatedEmail,
              })
              .then(function (res) {
                res.should.have.status(404);
                res.should.be.json;
                expect(res.body).to.equal('User to update not found');
              });
          })
      });

      it('nothing to update', function () {
        return agent
          .post('/signin')
          .send({
            email: email,
            password: process.env.TEST_PASS,
          })
          .then(function (res) {
            expect(res).to.have.cookie('jwt');
            return agent.put('/profile/156161').then(function (res) {
              res.should.have.status(400);
              res.should.be.json;
              expect(res.body).to.equal('Nothing to be updated');
            });
          })
      });

      describe('update single field', function () {
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

        it('success updating email', function () {
          return agent
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
            });
        });

        it('ensure user profile consistency', function () {
          return agent
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
              });
            })
        });
      });

      it('success updating multiple (username and email)', function () {
        return agent
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

        it('success updating password', function () {
          return agent
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
            });
        });

        it('verify sign in with new password', function () {
          return agent
            .post('/signin')
            .send({
              email: email,
              password: updatedPassword,
            })
            .then(function (res) {
              expect(res).to.have.cookie('jwt');
            })
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

      it('cannot delete user', function () {
        return agent
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
      });

      it('success deleting account', function () {
        return agent
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
          });
      });

      it('success purging all accounts', function () {
        return agent
          .post('/signin')
          .send({
            email: email,
            password: process.env.TEST_PASS,
          })
          .then(function (res) {
            expect(res).to.have.cookie('jwt');
            return agent
              .delete(`/purgeProfiles`)
              .then(function (res) {
                res.should.have.status(200);
                res.should.be.json;
                expect(res.body).to.equal(`All profiles deleted!`);
              })
              .finally(() => {
                agent.close();
              });
          });
      });
    });
  });
};
