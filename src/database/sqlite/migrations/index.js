const sqliteConnection = require('../../sqlite')
const createUsers = require('./createUsers')

async function migrationsRun() {
    const schemas = [
        createUsers
    ].join('')

    sqliteConnection()
        .catch(error => console.error(error))   
        // .then(db => db.exec(schemas))
}

module.exports = migrationsRun