const mongoose = require('mongoose')

const Person = mongoose.model('Person', {
    name: String,
    cpf: String,
})

module.exports = Person