const router = require('express').Router();
const performGetPost = require('../helper/puppeteer/performGetPost');
const performLogin = require('../helper/puppeteer/performLogin');
const performSyncUserData = require('../helper/puppeteer/performSyncUserData');
const spliceIntoChunks = require('../helper/spliceIntoChunks');

router.get('/', async (req, res) => {
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

// router.get('/unSynced', async (req, res) => {
//     const [savedPost, votedPost] = await performSyncUserData(browser);
//     res.json({ unSyncedSaved: savedPost.length, unSyncedVoted: votedPost.length })
// })

// router.get('/backup', async (req, res) => {
//     const userData = await UserData.find({}).then(data => data[0])
//     fs.writeFile("backup/userData.json", JSON.stringify(userData), err => err && console.err(err))
//     const savedPost = await SavedPost.find({}).then(data => data)
//     fs.writeFile("backup/savedPost.json", JSON.stringify(savedPost), err => err && console.err(err))
//     const votedPost = await VotedPost.find({}).then(data => data)
//     fs.writeFile("backup/votedPost.json", JSON.stringify(votedPost), err => err && console.err(err))
//     res.send("Backup Completed!")
// })

module.exports = router