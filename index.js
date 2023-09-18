require('dotenv').config({
  path: '.local.env'
})

const express = require('express')
const cookieParser = require('cookie-parser')
const app = express()
const path = require('path')
const http = require('http')
const server = http.createServer(app)

// Importar la configuración de la base de datos
require('./config/mongo')

// Habilitar express.json como alternativa a body-parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser(process.env.SECRET)) // initializing the lib
app.use(express.static(__dirname + '/node_modules'))

const session = require('express-session')
const sessionMiddleware = session({
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true
})
app.use(sessionMiddleware)

app.use('/', require('./routes/index.route'))
app.use('/api/auth', require('./routes/auth.route'))
app.use('/api/users', require('./routes/user.route'))

//npm insall --save ejs
app.set('view engine', 'ejs')

const PORT = process.env.PORT || 3000
// Iniciar el servidor
server.listen(PORT, () => {
  console.log('listening on *:' + PORT)
})
require('./socket')(server, sessionMiddleware)
