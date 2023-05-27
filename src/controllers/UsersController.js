// const { response, request } = require('express')
// const sqliteConnection = require('../database/sqlite')
const knex = require('../database/knex')
const { response, request } = require('express')
const AppError = require('../utils/AppError')
const { hash, compare } = require('bcryptjs')

class UsersController {
    async create(request, response) {
        const { name, email, password } = request.body
        
        const checkIfUserExist = await knex('users').where({ email }).first()

        if(checkIfUserExist) {
            throw new AppError('Este e-mail já está em uso.')
        }

        const hashedPassword = await hash(password, 8)

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

        const user = await knex('users').where({ id: user_id }).first()
        
        if(!user) {
            throw new AppError('Usuário não encontrado.')
        }
        
        const userWithUpdateEmail = await knex('users').where({email: email}).first()

        if(userWithUpdateEmail && userWithUpdateEmail.id !== user.id) {
            throw new AppError('Este e-mail já está em uso')
        }

        if(name.length !== 0) {
            user.name = name
        }

        if(email.length !== 0) {
            user.email = email
        }
        
        if(password && old_password) {
            const checkOldPassword = await compare(old_password, user.password)
            
            if(!checkOldPassword) {
                throw new AppError('A senha antiga não confere')
            }
            
            user.password = await hash(password, 8)
        }
        
        await knex('users')
            .where({ id: user_id })
            .update({
                name: user.name,
                email: user.email,
                password: user.password
            })
            .update('updated_at', knex.fn.now())   

        return response.status(201).json()
    }
}

module.exports = UsersController
