const User = require('../models/user.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.authenticateUser = async (req, res) => {
  const { nickemail, password } = req.body
  try {
    // Revisar que sea un usuario registrado
    let usuario = await User.findOne({ nickname: nickemail })
    if (!usuario) usuario = await User.findOne({ email: nickemail })
    if (!usuario)
      return res.render('pages/login', {
        message: {
          type: 'error',
          text: 'El usuario no existe'
        }
      })

    // Verificar contraseña
    const passCorrecto = await bcrypt.compare(
      password.toString(),
      usuario.password
    )
    if (!passCorrecto)
      return res.render('pages/login', {
        message: {
          type: 'error',
          text: 'Contraseña incorrecta'
        }
      })

    // Si todo es correcto: Crear y firmar JWT
    const payload = {
      usuario
    }
    const token = jwt.sign(payload, process.env.SECRET, {
      expiresIn: 3600 * 2 // 2 horas
    })

    res.cookie('token', token)
    res.redirect('/')
  } catch (error) {
    console.log(error)
  }
}
