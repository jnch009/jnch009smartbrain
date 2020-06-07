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
} = require("../index");

module.exports = function RegisterTests() {
  const [email, password, name] = ["test4@gmail.com", "testing12345", "test4"];

  describe("register", function () {
    beforeEach(function (done) {
      beforeTest(done);
    });

    afterEach(function (done) {
      afterTest(done);
    });

    it("missing email", function (done) {
      chai
        .request(app)
        .post("/register")
        .send({
          password: password,
          name: name,
        })
        .end(function (err, res) {
          res.should.have.status(400);
          res.should.be.json;
          expect(res.body).to.equal("Cannot leave fields empty");
          done();
        });
    });

    it("missing password", function (done) {
      chai
        .request(app)
        .post("/register")
        .send({
          email: email,
          name: name,
        })
        .end(function (err, res) {
          res.should.have.status(400);
          res.should.be.json;
          expect(res.body).to.equal("Cannot leave fields empty");
          done();
        });
    });

    it("missing name", function (done) {
      chai
        .request(app)
        .post("/register")
        .send({
          email: email,
          password: password,
        })
        .end(function (err, res) {
          res.should.have.status(400);
          res.should.be.json;
          expect(res.body).to.equal("Cannot leave fields empty");
          done();
        });
    });

    it("duplicate email", function (done) {
      chai
        .request(app)
        .post("/register")
        .send({
          email: "test3@gmail.com",
          name: name,
          password: password,
        })
        .end(function (err, res) {
          res.should.have.status(400);
          res.should.be.json;
          expect(res.body).to.equal(
            "Email already in use, please use another one"
          );
          done();
        });
    });

    it("successfully registered", function (done) {
      chai
        .request(app)
        .post("/register")
        .send({
          email: email,
          name: name,
          password: password,
        })
        .end(function (err, res) {
          res.should.have.status(200);
          res.should.be.json;
          expect(res).to.have.cookie("jwt");
          res.body.should.have.property("name");
          res.body.name.should.equal(name);
          res.body.should.have.property("email");
          res.body.email.should.equal(email);
          res.body.should.have.property("score");
          res.body.score.should.equal(0);
          res.body.should.have.property("joined");
          done();
        });
    });
  });
};
