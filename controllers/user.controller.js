const User = require('../models/user.model')
const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')

exports.createUser = async (req, res) => {
  // Revisar si hay errores
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    res.locals.message = {
      type: 'error',
      text: errores
        .formatWith((err) => err.msg)
        .array()
        .join('\n')
    }
    return res.render('pages/login')
  }

  // Extrar del body
  const { nickname, email, password } = req.body

  try {
    // Revisar que sea un usuario registrado
    let usuario = await User.findOne({ nickname })
    if (!usuario) usuario = await User.findOne({ email })
    if (usuario) {
      res.locals.message = {
        type: 'error',
        text: 'El usuario ya existe'
      }
      return res.render('pages/login')
    }

    // Crear nuevo usuario
    usuario = new User({
      nickname,
      email,
      password
    })
    // Hashear password
    const salt = await bcrypt.genSalt(8)
    usuario.password = await bcrypt.hash(password.toString(), salt) //Hasehar contraseña
    await usuario.save() //guardar

    // res.render('pages/home', { token, usuario })
    res.locals.message = {
      type: 'success',
      text: 'Usuario creado correctamente'
    }
    res.render('pages/login')
  } catch (error) {
    console.log(error)
    res.render('pages/login', {
      message: {
        type: 'error',
        text: 'Ha ocurrido un error en el servidor'
      }
    })
  }
}

exports.getPlayers = async () => {
  try {
    const players = await User.find()
    return players
  } catch (error) {
    console.log(error)
    return []
  }
}

exports.updatePlayers = async (players) => {
  try {
    players.forEach(async (player) => {
      if (!player) return

      const { nickname, totalScore, maxCombo, currentCombo } = player

      await User.findOneAndUpdate(
        { nickname },
        {
          totalScore,
          maxCombo,
          currentCombo
        }
      )
    })
  } catch (error) {
    console.log(error)
  }
}
