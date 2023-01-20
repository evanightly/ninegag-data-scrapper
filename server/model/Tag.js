const { model, Schema } = require('mongoose')
const Tag = model('Tag', {
    title: {
        type: String,
        required: [true, 'Tag title must be provided'],
    },
    tagType: {
        type: String,
        enum: ['Custom']
    },
    posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }]
})

module.exports = Tag