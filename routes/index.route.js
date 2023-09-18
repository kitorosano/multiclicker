// Rutas para autenticar usuarios
const router = require('express').Router()
const auth = require('../middleware/auth')

router.get('/login', auth, (req, res) => {
  if (req.usuario) return res.redirect('/')
  req.session.nickname = ''
  res.render('pages/login')
})

router.get('/', auth, (req, res) => {
  if (!req.usuario) return res.redirect('/login')
  req.session.nickname = req.usuario.nickname
  res.locals.usuario = req.usuario
  res.render('pages/home')
})

router.get('/logout', auth, (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid')
    res.clearCookie('token')
    res.redirect('/login')
  })
})

module.exports = router
