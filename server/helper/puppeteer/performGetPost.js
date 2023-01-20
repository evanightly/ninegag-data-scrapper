const { SYSTEM } = require('../../config.json')
const performGetPostData = require('./performGetPostData')
const Post = require('../../model/Post')
const RemovedPost = require('../../model/RemovedPost')
const Tag = require('../../model/Tag')
const performGetPost = async (browser, postChunks, type = 1) => {
    console.log("Performing scrap for type ", type)
    // let type = await findOne({ type: postType }).exec()

    // isPostTypeAlreadyExist = type.length
    // if (!isPostTypeAlreadyExist) type = await create({ type: postType })
    let totalPosts = 0, currentIndex = 0
    postChunks.map(post => post.map(() => totalPosts++))

    const res = []
    for (const posts of postChunks) {
        // Set pause time for each scrap, so cloudflare protection wont be triggered
        await new Promise(resolve => setTimeout(resolve, SYSTEM.GET_DATA_TIMEOUT))

        // Show scrap progresses
        console.log(`${currentIndex} of ${totalPosts} data has been scrapped`)

        for (const post of posts) {
            console.log(`Next queue : ${post}`)
            const postData = await performGetPostData(browser, post, type)
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

                // Reasign tags object value with newly created object
                postData.tags = postTags
                
                const newPost = await Post.create(postData)
                for (const tag of newPost.tags) {
                    await Tag.findByIdAndUpdate(tag, { $push: { posts: newPost._id } })
                }
            } else {
                await RemovedPost.create(postData)
            }
            currentIndex++
            res.push(postData)
        }
    }
    console.log("Data scrap completed")
    return res
}

module.exports = performGetPost