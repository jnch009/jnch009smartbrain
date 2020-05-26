require('dotenv').config();
// Update with your config settings.

module.exports = {
  test: {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      user: 'jnch009',
      password: process.env.DB_PASS,
      database: 'jnch009smartbraintest',
    },
    migrations: {
      directory: __dirname + '/db/migrations',
    },
    seeds: {
      directory: __dirname + '/db/seeds/test',
    },
  }
};
