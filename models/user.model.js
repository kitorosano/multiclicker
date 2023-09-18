const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
  nickname: { type: String, required: true, unique: true, max: 50 },
  email: { type: String, required: true, unique: true, match: /^.+@.+\..+$/g },
  password: { type: String, required: true, min: 6 },
  totalScore: { type: Number, default: 0 },
  currentCombo: { type: Number, default: 0 },
  maxCombo: { type: Number, default: 0 },
})

// Export the model
module.exports = mongoose.model('User', UserSchema)
