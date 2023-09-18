// Rutas para autenticar usuarios
const router = require('express').Router()
const authController = require('../controllers/auth.controller')

// Verifica con un auth en -> api/auth
router.post('/', authController.authenticateUser)

module.exports = router
