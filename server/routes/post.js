const router = require('express').Router();
const performGetPost = require('../helper/puppeteer/performGetPost');
const performLogin = require('../helper/puppeteer/performLogin');
const performSyncUserData = require('../helper/puppeteer/performSyncUserData');
const spliceIntoChunks = require('../helper/spliceIntoChunks');
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

router.get('/unsynced', async (req, res) => {
    const [savedPost, votedPost] = await performSyncUserData(browser);
    res.json({ unsyncedSaved: savedPost.length, unsyncedVoted: votedPost.length })
})

router.get('/sync', async (req, res) => {
    /**
     * Note: Please login manually in case your account prevented by cloudflare security
     * If the problem still exist, please try again few hours, or tomorrow
     */

    try {
        const browser = req.app.locals.browser
        await performLogin(browser);
        const [savedPost, votedPost] = await performSyncUserData(browser);
        const savedPostChunk = spliceIntoChunks(savedPost, 10)
        const votedPostChunk = spliceIntoChunks(votedPost, 10)

        const savedPostNumber = 1
        const votedPostNumber = 2
        savedPostChunk.length > 0 && await performGetPost(browser, savedPostChunk, savedPostNumber)
        votedPostChunk.length > 0 && await performGetPost(browser, votedPostChunk, votedPostNumber)
        console.log("Data Synced")
        res.send("Data Synced")
    } catch (error) {
        console.log(error)
        res.send("Something wrong, please check server console, for further information")
    }
})

router.get('/backup', async (req, res) => {
    const userData = await UserData.find({}).then(data => data[0])
    fs.writeFile("backup/userData.json", JSON.stringify(userData), err => err && console.err(err))
    const savedPost = await SavedPost.find({}).then(data => data)
    fs.writeFile("backup/savedPost.json", JSON.stringify(savedPost), err => err && console.err(err))
    const votedPost = await VotedPost.find({}).then(data => data)
    fs.writeFile("backup/votedPost.json", JSON.stringify(votedPost), err => err && console.err(err))
    res.send("Backup Completed!")
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
        .populate('tags', ['title', 'tagType'])
        .sort({ dateCreated: 'desc' })
        .skip(skip)
        .limit(limit)
    res.json(posts)
})

module.exports = router