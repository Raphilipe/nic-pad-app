const mongoose = require('mongoose')

const User = mongoose.model('User', {
    user: String,
    firstName: String,
    lastName: String,
    password: String,
    theme: String,
    verified: Boolean,
    activationToken: String,
    resetPassToken: String
})

module.exports = User