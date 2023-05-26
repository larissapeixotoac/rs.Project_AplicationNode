const { Router } = require('express')
const TagsController = require('../controllers/TagsController')
const ensureAuthenticared = require('../middleware/ensureAuthenticated')


const tagsRoutes = Router()
const tagsController = new TagsController

tagsRoutes.get('/', ensureAuthenticared, tagsController.index)

module.exports = tagsRoutes