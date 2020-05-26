const bcrypt = require('bcrypt');
require('dotenv').config();

const hash = bcrypt.hashSync(process.env.TEST_PASS, 10);

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('login').del()
    .then(function () {
      // Inserts seed entries
      return knex('login').insert([
        { email: 'test1@gmail.com', hash: hash },
        { email: 'test2@gmail.com', hash: hash },
        { email: 'test3@gmail.com', hash: hash },
      ]);
    })
};