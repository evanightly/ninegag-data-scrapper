const router = require('express').Router();
const Post = require('../model/Post');

router.get('/', async (req, res) => {
    res.json(await Post.find({})
        .where('title')
        .ne("Post Deleted")
        .populate('tags')
        .sort({ dateCreated: 'desc' }))
})

router.get('/search', async (req, res) => {
    let { searchQuery } = req.query
    const result = await Post.find({ title: { $regex: `.*${searchQuery}.*` } }).populate('tags', '-posts')
    res.json(result);
})

router.get('/total/:postType', async (req, res) => {
    const { postType } = req.params
    const posts = await Post
        .find({ postType })
        .countDocuments()
    res.json(posts)
})

router.get('/:postType/:skip/:limit', async (req, res) => {
    let { postType, skip, limit } = req.params
    if (skip < 0) skip = 0
    const posts = await Post
        .find({ postType })
        .where({ $or: [{ archived: { $exists: false } }, { archived: false }] })
        .populate('tags', ['title', 'tagType'])
        .sort({ dateCreated: 'desc' })
        .skip(skip)
        .limit(limit)
    res.json(posts)
})

module.exports = router