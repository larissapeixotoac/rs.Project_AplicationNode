const knex = require('../database/knex')
const { response, request } = require('express')
const AppError = require('../utils/AppError')

class NotesController {
    async create(request, response) {
        const { title, description, rating, tags } = request.body
        const user_id  = request.user.id

        if(rating < 1 || rating > 5) {
            throw new AppError('A nota do filme não é válida. É aceitos valores inteiros que podem variar de 1 a 5.')
        } if(rating > 1 && rating < 2 ) {
            throw new AppError('A nota do filme não é válida. É aceitos valores inteiros que podem variar de 1 a 5.')
        } if(rating > 2 && rating < 3 ) {
            throw new AppError('A nota do filme não é válida. É aceitos valores inteiros que podem variar de 1 a 5.')
        } if(rating > 3 && rating < 4 ) {
            throw new AppError('A nota do filme não é válida. É aceitos valores inteiros que podem variar de 1 a 5.')
        } if(rating > 4 && rating < 5 ) {
            throw new AppError('A nota do filme não é válida. É aceitos valores inteiros que podem variar de 1 a 5.')
        }
        
        const [note_id] = await knex('movie_notes').insert({
            title,
            description,
            rating,
            user_id
        })

        const tagsInsert = tags.map(name => {
            return {
                note_id,
                user_id,
                name
            }
        })

        await knex('movie_tags').insert(tagsInsert)

        return response.json()
    }

    async show(request, response) {
        const { id } = request.params

        const note = await knex('movie_notes').where({ id }).first()
        const tags = await knex('movie_tags').where({ note_id: id }).orderBy('name')

        if(!note) {
            throw new AppError('Essa nota não existe.')
        }

        return response.json({
            ...note,
            tags
        })
    }

    // async update(request, response) {
    //     const { title, description, rating, tags } = request.body
    //     const { id } = request.params

    //     const [note_id] = await knex('movie_notes').where({ id })

    //     if(!note_id) {
    //         throw new AppError('A nota não existe.')
    //     }

    //     if(tags) { 
    //         throw new AppError('Não é possível criar novas tags')
    //     }

    //     if(title) {
    //         await knex('movie_notes').where({ id }).insert({ title })
    //     } if(description) {
    //         await knex('movie_notes').where({ id }).insert({ description })
    //     } if (rating) {
    //         await knex('movie_notes').where({ id }).insert({ rating })
    //     }

    //     return response.json({
    //         note_id
    //     })
    // } Tentativa pausada por agora

    async delete(request, response) {
        const { id } = request.params

        await knex('movie_notes').where({ id }).delete()

        return response.json()
    }

    async index(request, response) {
        const { title, user_id, tags } = request.query

        let notes

        if(tags) {
            const filterTags = tags.split(',').map(tag => tag.trim())

            notes = await knex('movie_tags')
                .select([
                    'movie_notes.id',
                    'movie_notes.title',
                    'movie_notes.rating',
                    'movie_notes.user_id'
                ])
                .where('movie_notes.user_id', user_id)
                .whereLike('movie_notes.title', `%${title}%`)
                .whereIn('name', filterTags)
                .innerJoin('movie_notes', 'movie_notes.id', 'movie_tags.note_id')
                .orderBy('movie_notes.title')

        } if(!title) {
            notes = await knex('movie_notes').where({ user_id }).orderBy('title')

        }  else {
            notes = await knex('movie_notes')
                .where({ user_id })
                .whereLike('title', `%${title}%`)
                .orderBy('title')
        }

        

        const userTags = await knex('movie_tags').where({ user_id })

        const notesWithTags = notes.map(note => {
            const noteTags = userTags.filter(tag => tag.note_id === note.id)
            
            return {
                ...note,
                tags: noteTags
            }
        })

        return response.json(notesWithTags)
    }
}

module.exports = NotesController