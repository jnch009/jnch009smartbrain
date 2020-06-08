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
} = require('./index');

chai.use(chaiHttp);

const signin = require('./signin/signinTests');
const root = require('./root/rootTests');
const register = require('./register/registerTests');
const signout = require('./signout/signoutTests');
const profile = require('./profile/profileTests');
const image = require('./image/imageTests');

describe('Endpoint tests', function () {
  beforeEach(function (done) {
    setTimeout(function () {
      done();
    }, 100);
  });

  signin();
  root();
  register();
  signout();
  profile();
  image();
});
