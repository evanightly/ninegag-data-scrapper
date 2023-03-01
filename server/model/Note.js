const { model } = require('mongoose')
const Note = model('Note', {
    note: String
})

module.exports = Note