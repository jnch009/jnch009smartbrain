const {
  assert,
  chai,
  should,
  chaiHttp,
  knex,
  app,
  expect,
} = require('./index');

chai.use(chaiHttp);

const signin = require('./signin/signinTests');
const root = require('./root/rootTests');
const register = require('./register/registerTests');
const signout = require('./signout/signoutTests');
const profile = require('./profile/profileTests');
const image = require('./image/imageTests');

describe('Array', function () {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});

signin();
root();
register();
signout();
profile();
image();