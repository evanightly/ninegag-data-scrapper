const { model, Schema } = require('mongoose')
const Post = model('Post', {
    id: String,
    title: String,
    dateCreated: Date,
    commentsCount: Number,
    upvoteCount: Number,
    downvoteCount: Number,
    isAnonymous: Boolean,
    hasLongPostCover: Boolean,
    nsfw: Boolean,
    mediaType: String,
    mediaSources: Object,
    postType: Number,
    author: {
        accountId: String,
        userId: String,
        avatarUrl: String,
        username: String
    },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    archived: {
        type: Boolean,
        default: false
    }
})

module.exports = Post