require('dotenv').config();
// Update with your config settings.

module.exports = {
  test: {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      user: 'jnch009',
      password: process.env.DB_PASS,
      database: 'jnch009smartbraintest'
    },
    log: {
      warn(message){
        if (
          message ===
          'FS-related option specified for migration configuration. This resets migrationSource to default FsMigrations'
        ) {
          return;
        }
        console.log(message);
      }
    },
    migrations: {
      directory: __dirname + '/db/migrations'
    },
    seeds: {
      directory: __dirname + '/db/seeds/test'
    }
  },

  development: {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      user: 'jnch009',
      password: process.env.DB_PASS,
      database: 'jnch009smartbrain'
    },
    migrations: {
      directory: __dirname + '/db/migrations'
    }
  },

  production: {
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    },
    migrations: {
      directory: __dirname + '/db/migrations'
    }
  }
};
