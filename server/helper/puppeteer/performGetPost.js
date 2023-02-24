const { SYSTEM } = require('../../config.json')
const performGetPostData = require('./performGetPostData')
const Post = require('../../model/Post')
const RemovedPost = require('../../model/RemovedPost')
const Tag = require('../../model/Tag')
const download = require('download-file')
const ScrapProgress = require('../../model/ScrapProgress')

const performGetPost = async (browser, postChunks, type = 1) => {
    console.log("Performing scrap for type ", type)
    let totalPosts = 0, currentIndex = 0
    postChunks.map(post => post.map(() => totalPosts++))

    await ScrapProgress.findOneAndUpdate({}, { maxPost: totalPosts }, { upsert: true, })
    const res = []
    for (const posts of postChunks) {
        // Set pause time for each scrap, so cloudflare protection wont be triggered
        await new Promise(resolve => setTimeout(resolve, SYSTEM.GET_DATA_TIMEOUT))

        // Show scrap progresses
        console.log(`${currentIndex} of ${totalPosts} data has been scrapped`)

        for (const post of posts) {
            console.log(`Next queue : ${post}`)
            const postData = await performGetPostData(browser, post, type)

            let url = ""
            const options = {}

            // Perform download the media file
            if (postData.hasOwnProperty('mediaSources')) {
                if (postData.mediaType === "Animated") {
                    url = postData.mediaSources.image460sv.url
                    options.directory = "./public/video/"
                    options.filename = `${postData.id}.mp4`
                } else {
                    url = postData.mediaSources.image700.url
                    options.directory = "./public/image/"
                    options.filename = `${postData.id}.jpg`
                }
                download(url, options, err => {
                    if (err) throw err
                    console.log('File Downloaded')
                })
            }

            if (postData.tags) {
                let postTags = []
                // Create new tag
                for (let tag of postData.tags) {
                    tag = tag.toLowerCase()
                    const searchForTag = await Tag.findOne({ "title": tag }).exists('tagType', false)
                    if (searchForTag !== null) {
                        postTags.push(searchForTag._id)
                    } else {
                        const newTag = await Tag.create({ title: tag })
                        postTags.push(newTag._id)
                    }
                }

                // Reassign tags object value with newly created object
                postData.tags = postTags

                const newPost = await Post.create(postData)
                for (const tag of newPost.tags) {
                    await Tag.findByIdAndUpdate(tag, { $push: { posts: newPost._id } })
                }
            } else {
                await RemovedPost.create(postData)
            }
            currentIndex++
            await ScrapProgress.findOneAndUpdate({}, { scrapped: currentIndex })
            res.push(postData)
        }
    }
    console.log("Data scrap completed")
    return res
}

module.exports = performGetPost