// Rutas para crear usuarios
const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')
const auth = require('../middleware/auth')
const { check } = require('express-validator')

// Crea un usuario en -> api/users
router.post(
  '/',
  [
    check('nickname', 'El nickname es obligatorio').not().isEmpty(),
    check('email', 'Agrega un email valido').isEmail(),
    check(
      'password',
      'La contraseña debe contener minimo 6 caracteres'
    ).isLength({ min: 6 })
  ],
  userController.createUser
)

module.exports = router
