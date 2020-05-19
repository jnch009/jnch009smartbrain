require('dotenv').config();
process.env.NODE_ENV = 'test';

const assert = require('assert');
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const knex = require('../db/knex');
const app = require('../server');
const expect = chai.expect;
const bcrypt = require('bcrypt');

const beforeTest = (done) => {
  knex.migrate.rollback().then(function () {
    knex.migrate.latest().then(function () {
      return knex.seed.run().then(function () {
        done();
      });
    });
  });
}

const afterTest = done => {
  knex.migrate.rollback().then(function () {
    done();
  });
};

module.exports = {
  assert,
  chai,
  should,
  chaiHttp,
  knex,
  app,
  expect,
  bcrypt,
  beforeTest,
  afterTest,
};
