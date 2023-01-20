const { SELECTORS, NINEGAG } = require('../../config.json')
const pageInitializer = require('./pageInitializer')
const { POST_BODY } = SELECTORS.POST;

const performGetPostData = async (browser, postId, type) => {

    const page = await pageInitializer(browser)
    await page.goto(NINEGAG.POST_DOMAIN + postId, { waitUntil: 'networkidle2' })

    if (await page.$(POST_BODY) !== null) {
        const result = await page.evaluate(() => {
            const postObject = window._config.data.post
            const creatorObject = postObject.creator
            const authorObject = creatorObject === null ? {} : {
                accountId: creatorObject.accountId,
                userId: creatorObject.userId,
                avatarUrl: creatorObject.avatarUrl,
                username: creatorObject.username
            }
            const tagsArray = postObject.tags.map(tag => tag.key)
            const date = new Date(window._config.data.post.creationTs * 1000).toISOString()
            return {
                id: postObject.id,
                title: postObject.title,
                dateCreated: date,
                commentsCount: postObject.commentsCount,
                upvoteCount: postObject.upVoteCount,
                downvoteCount: postObject.downVoteCount,
                isAnonymous: postObject.isAnonymous,
                hasLongPostCover: postObject.hasLongPostCover,
                nsfw: postObject.nsfw,
                mediaType: postObject.type,
                mediaSources: postObject.images,
                author: authorObject,
                tags: tagsArray
            }
        })

        result.postType = type
        // console.log(result)
        await page.close()
        return result
    } else {
        await page.close()
        return { id: postId, title: "Post Deleted" }
    }
}

module.exports = performGetPostData