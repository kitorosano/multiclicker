// Conexion a mongo
const mongoose = require('mongoose')
const dev_db_url = process.env.MONGODB || ''

mongoose.connect(dev_db_url).then(() => {
  console.log('Conectado al MongoDB')
})

// mongoose.Promise = global.Promise

// const db = mongoose.connection

// db.on('error', console.error.bind(console, 'MongoDB connection error:'))
