const router = require('express').Router()
const { isAuthenticated } = require('../middlewares/auth')
const { isAdmin } = require('../middlewares/role')
const ctrl = require('../controllers/upload.controller')

// The JSON body parser for this router is mounted in app.js with a larger
// limit (data-URI images / short videos).
router.post('/', isAuthenticated, isAdmin, ctrl.upload)

module.exports = router
