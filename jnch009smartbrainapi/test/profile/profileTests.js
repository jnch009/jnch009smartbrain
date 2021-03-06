const {
  chai,
  app,
  expect,
  beforeTest,
  afterTest
} = require('../index');

/* eslint-disable no-undef */
module.exports = function ProfileTests() {
  const [id, email, name] = [3, 'test3@gmail.com', 'test3'];
  const [updatedEmail, updatedPassword, updatedName] = [
    'testJeremy@gmail.com',
    'jsdkfljaskdljf!@!@!@',
    'Jeremy'
  ];
  const currentPasswordIncorrect = 'wieuwioefjwiojfiojewofj';
  let agent = chai.request.agent(app);

  describe('profile', function () {
    describe('get profile', function () {
      beforeEach(function (done) {
        beforeTest(done);
      });

      afterEach(function (done) {
        afterTest(done);
      });

      it('cannot get user', function () {
        return agent
          .post('/signin')
          .send({
            email: email,
            password: process.env.TEST_PASS
          })
          .then(function (res) {
            expect(res).to.have.cookie('jwt');
            return agent.get('/profile/156161').then(function (res) {
              res.should.have.status(404);
              res.should.be.json;
              expect(res.body).to.equal('User not found');
            });
          });
      });

      it('success getting user by jwt', function () {
        return agent
          .post('/signin')
          .send({
            email: email,
            password: process.env.TEST_PASS
          })
          .then(function (res) {
            expect(res).to.have.cookie('jwt');
            return agent.get('/profile').then(function (res) {
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
          });
      });

      it('success getting user', function () {
        return agent
          .post('/signin')
          .send({
            email: email,
            password: process.env.TEST_PASS
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
          });
      });

      it('success getting all users', function () {
        return agent
          .post('/signin')
          .send({
            email: email,
            password: process.env.TEST_PASS
          })
          .then(function (res) {
            expect(res).to.have.cookie('jwt');
            return agent.get('/allProfiles').then(function (res) {
              res.should.have.status(200);
              res.should.be.json;
              res.body.should.have.length(3);
            });
          });
      });
    });

    describe('update profile', function () {
      describe('update negative tests', function () {
        beforeEach(function (done) {
          beforeTest(done);
        });

        afterEach(function (done) {
          afterTest(done);
        });
        it('cannot update user', function () {
          return agent
            .post('/signin')
            .send({
              email: email,
              password: process.env.TEST_PASS
            })
            .then(function (res) {
              expect(res).to.have.cookie('jwt');
              return agent
                .put('/profile/156161')
                .send({
                  email: updatedEmail
                })
                .then(function (res) {
                  res.should.have.status(404);
                  res.should.be.json;
                  expect(res.body).to.equal('User to update not found');
                });
            });
        });

        it('email is empty', function () {
          return agent
            .post('/signin')
            .send({
              email: email,
              password: process.env.TEST_PASS
            })
            .then(function (res) {
              expect(res).to.have.cookie('jwt');
              return agent
                .put(`/profile/${id}`)
                .send({
                  email: '',
                  name: name
                })
                .then(function (res) {
                  res.should.have.status(400);
                  res.should.be.json;
                  expect(res.body).to.equal('Cannot leave fields blank');
                });
            });
        });

        it('name is empty', function () {
          return agent
            .post('/signin')
            .send({
              email: email,
              password: process.env.TEST_PASS
            })
            .then(function (res) {
              expect(res).to.have.cookie('jwt');
              return agent
                .put(`/profile/${id}`)
                .send({
                  email: email,
                  name: ''
                })
                .then(function (res) {
                  res.should.have.status(400);
                  res.should.be.json;
                  expect(res.body).to.equal('Cannot leave fields blank');
                });
            });
        });
      });

      describe('update profile fields', function () {
        describe('email update and login', function () {
          before(function (done) {
            beforeTest(done);
          });

          after(function (done) {
            afterTest(done);
          });

          it('success updating email', function () {
            return agent
              .post('/signin')
              .send({
                email: email,
                password: process.env.TEST_PASS
              })
              .then(function (signInRes) {
                expect(signInRes).to.have.cookie('jwt');
              })
              .then(function () {
                return agent.put(`/profile/${id}`).send({
                  email: updatedEmail
                });
              })
              .then(function (putRes) {
                putRes.should.have.status(200);
                putRes.should.be.json;
                putRes.body.should.have.property('email');
                putRes.body.email.should.equal(updatedEmail);
              });
          });

          it('ensure user profile consistency', function () {
            return agent
              .post('/signin')
              .send({
                email: updatedEmail,
                password: process.env.TEST_PASS
              })
              .then(function (signInRes) {
                expect(signInRes).to.have.cookie('jwt');
              })
              .then(function () {
                return agent.get(`/profile/${id}`);
              })
              .then(function (putRes) {
                putRes.should.have.status(200);
                putRes.should.be.json;
                putRes.body.should.have.property('name');
                putRes.body.name.should.equal(name);
              });
          });
        });

        describe('update multiple fields', function () {
          before(function (done) {
            beforeTest(done);
          });

          after(function (done) {
            afterTest(done);
          });

          it('success updating multiple (username and email)', function () {
            return agent
              .post('/signin')
              .send({
                email: email,
                password: process.env.TEST_PASS
              })
              .then(function (res) {
                expect(res).to.have.cookie('jwt');
                return agent
                  .put(`/profile/${id}`)
                  .send({
                    email: updatedEmail,
                    name: updatedName
                  })
                  .then(function (res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property('email');
                    res.body.email.should.equal(updatedEmail);
                    res.body.should.have.property('name');
                    res.body.name.should.equal(updatedName);
                  });
              });
          });
        });
      });

      describe('update password field', function () {
        describe('negative password tests', function () {
          beforeEach(function (done) {
            beforeTest(done);
          });

          afterEach(function (done) {
            afterTest(done);
          });

          it('user not found for updating password', function () {
            return agent
              .post('/signin')
              .send({
                email: email,
                password: process.env.TEST_PASS
              })
              .then(function (res) {
                expect(res).to.have.cookie('jwt');
                return agent
                  .put('/profile/passwordUpdate/123')
                  .send({
                    password: updatedPassword,
                    currentPassword: process.env.TEST_PASS
                  })
                  .then(function (res) {
                    res.should.have.status(404);
                    res.should.be.json;
                    expect(res.body).to.equal('User to update not found');
                  });
              });
          });

          it('user current password incorrect', function () {
            return agent
              .post('/signin')
              .send({
                email: email,
                password: process.env.TEST_PASS
              })
              .then(function (res) {
                expect(res).to.have.cookie('jwt');
                return agent
                  .put(`/profile/passwordUpdate/${id}`)
                  .send({
                    currentPassword: currentPasswordIncorrect,
                    password: updatedPassword
                  })
                  .then(function (res) {
                    res.should.have.status(400);
                    res.should.be.json;
                    expect(res.body).to.equal('Current password is incorrect');
                  });
              });
          });
        });

        describe('password update with signin', function () {
          before(function (done) {
            beforeTest(done);
          });

          after(function (done) {
            afterTest(done);
          });

          it('success updating password', function () {
            return agent
              .post('/signin')
              .send({
                email: email,
                password: process.env.TEST_PASS
              })
              .then(function (res) {
                expect(res).to.have.cookie('jwt');
                return agent
                  .put(`/profile/passwordUpdate/${id}`)
                  .send({
                    password: updatedPassword,
                    currentPassword: process.env.TEST_PASS
                  })
                  .then(function (res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    expect(res.body).to.equal('Password Updated');
                  });
              });
          });

          it('verify sign in with new password', function () {
            return agent
              .post('/signin')
              .send({
                email: email,
                password: updatedPassword
              })
              .then(function (res) {
                expect(res).to.have.cookie('jwt');
              });
          });
        });
      });
    });

    describe('delete profile', function () {
      beforeEach(function (done) {
        beforeTest(done);
      });

      afterEach(function (done) {
        afterTest(done);
      });

      it('cannot delete user', function () {
        return agent
          .post('/signin')
          .send({
            email: email,
            password: process.env.TEST_PASS
          })
          .then(function (res) {
            expect(res).to.have.cookie('jwt');
            return agent.get('/profile/156161').then(function (res) {
              res.should.have.status(404);
              res.should.be.json;
              expect(res.body).to.equal('User not found');
            });
          });
      });

      it('success deleting account', function () {
        return agent
          .post('/signin')
          .send({
            email: email,
            password: process.env.TEST_PASS
          })
          .then(function (res) {
            expect(res).to.have.cookie('jwt');
            return agent.delete(`/profile/${id}`).then(function (res) {
              res.should.have.status(200);
              res.should.be.json;
              expect(res.body).to.equal('User successfully deleted');
            });
          });
      });

      it('success purging all accounts', function () {
        return agent
          .post('/signin')
          .send({
            email: email,
            password: process.env.TEST_PASS
          })
          .then(function (res) {
            expect(res).to.have.cookie('jwt');
            return agent
              .delete('/purgeProfiles')
              .then(function (res) {
                res.should.have.status(200);
                res.should.be.json;
                expect(res.body).to.equal('All profiles deleted!');
              })
              .finally(() => {
                agent.close();
              });
          });
      });
    });
  });
};
