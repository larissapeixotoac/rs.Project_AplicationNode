// const { response, request } = require('express')
// const sqliteConnection = require('../database/sqlite')
const knex = require('../database/knex')
const AppError = require('../utils/AppError')
const { hash, compare } = require('bcryptjs')

class UsersController {
    async create(request, response) {
        const { name, email, password } = request.body

        // const database = await sqliteConnection()
        // const checkIfUserExist = await database.get('SELECT * FROM users WHERE email = (?)', [email])
        
        const checkIfUserExist = await knex('users').where({ email }).first()

        if(checkIfUserExist) {
            throw new AppError('Este e-mail já está em uso.')
        }

        const hashedPassword = await hash(password, 8)

        // await database.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword])

        const [id] = await knex('users').insert({
            name,
            email,
            password: hashedPassword
        })

        return response.status(201).json()
    }

    async update(request, response) {
        const { name, email, password, old_password } = request.body
        const user_id = request.user.id
        // const database = await sqliteConnection()
        // const user = await database.get('SELECT * FROM users WHERE id = (?)', [id])
        const id = user_id
        
        const user = await knex('users').where({ id }).first()
                
        if(!user) {
            throw new AppError('Usuário não encontrado.')
        }
        
        // const userWithUpdateEmail = await database.get('SELECT * FROM users WHERE email = (?)', [email])

        const userWithUpdateEmail = await knex('users').where({ email })
        
        if((userWithUpdateEmail === true) && userWithUpdateEmail.id !== user.id) {
            throw new AppError('Este e-mail já está em uso')
        }
        
        user.name = name ?? user.name
        user.email = email ?? user.email
        
        if(password && old_password) {
            const checkOldPassword = await compare(old_password, user.password)
            
            if(!checkOldPassword) {
                throw new AppError('A senha antiga não confere')
            }
            
            user.password = await hash(password, 8)
        }
        
        // await database.run(`
        //     UPDATE users SET
        //     name = ?,
        //     email = ?,
        //     password = ?,
        //     updated_at = DATETIME('now')
        //     WHERE id = ?`,
        //     [user.name, user.email, user.password, id]
        // )

        await knex('users')
            .where({ id })
            .update({
                name,
                email,
                password
            })
            .update('updated_at', knex.fn.now())   

        return response.status(201).json()
    }
}

module.exports = UsersController
