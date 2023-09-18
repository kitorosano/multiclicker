const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
  // Leer el token del header
  const token = req.cookies.token

  if (!token) {
    res.locals.message = 'Acceso denegado'
    return next()
  }

  try {
    const cifrado = jwt.verify(token, process.env.SECRET)
    req.usuario = cifrado.usuario
    res.locals.message = ''
  } catch (error) {
    if (error.name == 'TokenExpiredError')
      res.locals.message = 'Token no válido'
    else res.locals.message = 'Acceso denegado'
  } finally {
    next()
  }
}
