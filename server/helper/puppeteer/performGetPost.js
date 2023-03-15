const { SYSTEM } = require('../../config.json')
const performGetPostData = require('./performGetPostData')
const Post = require('../../model/Post')
const RemovedPost = require('../../model/RemovedPost')
const Tag = require('../../model/Tag')
const Downloader = require('nodejs-file-downloader')
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

        // Show scrap progress
        console.log(`${currentIndex} of ${totalPosts} data has been scrapped`)

        for (const post of posts) {
            console.log(`Next queue : ${post}`)
            const postData = await performGetPostData(browser, post, type)

            // Perform download the media file
            if (postData.hasOwnProperty('mediaSources')) {
                try {
                    if (postData.mediaType === "Animated") {
                        const videoDownloader = new Downloader({
                            url: postData.mediaSources.image460sv.url,
                            directory: "./public/video",
                            fileName: `${postData.id}.mp4`,
                            cloneFiles: false
                        })

                        await videoDownloader.download()
                    }

                    const imageDownloader = new Downloader({
                        url: postData.mediaSources.image700.url,
                        directory: "./public/image",
                        fileName: `${postData.id}.jpg`,
                        cloneFiles: false
                    })

                    await imageDownloader.download()
                } catch (error) {
                    console.log("Download failed", error);
                }
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