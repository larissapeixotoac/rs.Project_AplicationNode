const sqlite3 = require('sqlite3')
const sqlite = require('sqlite')
//const path = require('path) 
//this is used normally to conect to the database and not oring about the OS, but for me i goint to put a windows folder because i cant access tha linux folder from the windows.

async function sqliteConnection() {
    const database = await sqlite.open({
        filename: '/home/larissa/shared/API_rocketMovies_database.db', //using linux on a VM, and i can't access from windows the linux directory
        driver: sqlite3.Database
    })

    return database
}

module.exports = sqliteConnection