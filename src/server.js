require('express-async-errors')

const express = require('express')
const routes = require('./routes')
const AppError = require('./utils/AppError')
const migrationsRun = require('./database/sqlite/migrations')

const app = express() //initialize

migrationsRun()

app.use(express.json()); //to the server undestand that the body will be in json format
app.use(routes)


app.use(( error, request, response, next ) => {
    if(error instanceof AppError) {
        return response.status(error.statusCode).json({
            status: "error",
            message: error.message
        }) //client error
    }

    return response.status(500).json({
        status: "error",
        message: "Internal server error"
    }) //server error
})

const PORT = 3333
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`))
