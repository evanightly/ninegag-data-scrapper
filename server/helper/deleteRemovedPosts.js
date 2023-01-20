const deleteRemovedPost = async () => {
    /*  Steps to reproduce
        - Find saved post that doesn't available in userdata
        - Loop through each post
            - Check if that post contain tag
                - if true
                    - Pull post _id from each tag
            - Delete Post */
    const localStorage = await performGetUserData(browser)
    console.log(localStorage)
    const post = await Post.find()
    console.log(post)

    // const [savedUserData, votedUserData] = [localStorage.saves, Object.entries(localStorage.votes).filter(post => localStorage.votes[post[0]]).map(v => v[0])]
    // const [voted, saved] = await Promise.all([await VotedPost.find({}), await SavedPost.find({})])
    // const deletedSaved = saved.filter(s => savedUserData.indexOf(s.id) === -1).map(s => s.id)
    // const deletedVoted = voted.filter(v => votedUserData.indexOf(v.id) === -1).map(v => v.id)
    // await Promise.all([await VotedPost.deleteMany({ id: { $in: deletedVoted } }), await SavedPost.deleteMany({ id: { $in: deletedSaved } })])
    // return [deletedSaved, deletedVoted]
}

module.exports = deleteRemovedPost