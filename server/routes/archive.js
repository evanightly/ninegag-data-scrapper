const router = require('express').Router();
const Post = require('../model/Post');

router.get('/', async (req, res) => {
    const archivedPost = await Post
        .find({ archived: true })
        .populate('tags', ['title', 'tagType'])
        .sort({ dateCreated: 'desc' })
    res.json(archivedPost)
})

router.post('/', async (req, res) => {
    const { _id, archived } = req.body
    const archivedPost = await Post.findByIdAndUpdate(_id, {
        archived
    }, { new: true })
    res.json(archivedPost)
})

module.exports = router