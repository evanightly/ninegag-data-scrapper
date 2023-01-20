const { model } = require('mongoose')
const RemovedPost = model('RemovedPost', {
    id: String
})

module.exports = RemovedPost