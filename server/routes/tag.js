const Tag = require('../model/Tag');
const Post = require('../model/Post');
const router = require('express').Router();

router.get('/', async (req, res) => {
    const tags = await Tag
        .aggregate([{ $project: { title: 1, postSize: { $size: '$posts' }, tagType: 1 } }])
        .sort({ tagType: 'desc', title: 'asc' })
    res.json(tags)
})

router.post('/', async (req, res) => {
    let { post_id, tagTitle } = req.body
    tagTitle = tagTitle.toLowerCase()
    const addedTag = await Tag.findOne({ title: tagTitle, tagType: 'Custom' })

    let result = {}

    if (!addedTag) {
        const createdTag = await Tag.create({
            title: tagTitle,
            tagType: 'Custom',
            posts: [post_id]
        })

        result.resultType = 'New'
        result.post = await Post.findByIdAndUpdate(post_id, { $addToSet: { tags: createdTag._id } }, { new: true }).populate('tags')
        result.tag = createdTag
    } else {
        const createdTag = await Tag.findByIdAndUpdate(addedTag._id, { $addToSet: { posts: post_id } }, { new: true })

        result.resultType = 'Update'
        result.post = await Post.findByIdAndUpdate(post_id, { $addToSet: { tags: addedTag._id } }, { new: true }).populate('tags')
        result.tag = createdTag
    }
    res.send(result)
})

router.post('/remove', async (req, res) => {
    const { post_id, tag_id } = req.body
    const post = await Post.findByIdAndUpdate(post_id, { $pull: { tags: tag_id } }, { new: true }).populate('tags')
    const tag = await Tag.findByIdAndUpdate(tag_id, { $pull: { posts: post_id } }, { new: true })

    if (!tag.posts.length) {
        await Tag.findByIdAndDelete(tag._id)
    }

    res.send(post)
})

router.get('/:id', async (req, res) => {
    const { id } = req.params
    const { posts } = await Tag.findById(id).select('posts -_id').populate({
        path: 'posts',
        populate: {
            path: 'tags',
            select: 'title tagType'
        }
    })
    res.send(posts)
})

module.exports = router