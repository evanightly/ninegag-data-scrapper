const { model } = require('mongoose')
const ScrapProgress = model('ScrapProgress', {
    maxPost: Number,
    scrapped: Number
})

module.exports = ScrapProgress