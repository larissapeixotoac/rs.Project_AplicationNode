const path = require('path') //not using because i cant open the database (sqlite) on a linux folder when i'm using the windows


module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: '/home/larissa/shared/API_rocketMovies_database.db'
    },
    pool: {
      afterCreate: (conn, cb) => conn.run('PRAGMA foreign_keys = ON', cb)
    },
    migrations: {
      directory: path.resolve(__dirname, 'src', 'database', 'knex', 'migrations')
    },
    useNullAsDefault: true
  },
};
