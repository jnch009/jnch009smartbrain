require('dotenv').config();
process.env.NODE_ENV = 'test';

const assert = require('assert');
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const knex = require('../db/knex');
const app = require('../server');
const expect = chai.expect;

module.exports = {
  assert,
  chai,
  should,
  chaiHttp,
  knex,
  app,
  expect,
};
