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

describe('Array', function () {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});

describe('signin', function(){
  signin();
})

describe('root', function(){
  root();
})
