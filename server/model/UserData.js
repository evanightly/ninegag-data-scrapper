const mongoose = require('mongoose')
const UserData = mongoose.model('UserData', {
    saved: [String],
    voted: [String]
})

module.exports = UserData