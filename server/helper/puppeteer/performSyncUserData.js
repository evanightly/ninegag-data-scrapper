const UserData = require("../../model/UserData");
const Post = require("../../model/Post");
const performGetUserData = require("./performGetUserData");
const RemovedPost = require("../../model/RemovedPost");
const performSyncUserData = async (browser) => {
    // Upload user data from 9gag localstorage
    const localStorage = await performGetUserData(browser);
    let [saved, voted] = [localStorage.saves, Object.entries(localStorage.votes).filter(post => localStorage.votes[post[0]] === 1).map(v => v[0])]

    let removedPost = await RemovedPost.find({}, '-_id -__v').exec()
    removedPost = removedPost.map(({ id }) => id)
    saved = saved.filter(id => removedPost.indexOf(id) === -1)
    voted = voted.filter(id => removedPost.indexOf(id) === -1)

    UserData.create({ saved, voted }).then(() => console.log("UserData successfully uploaded!")).catch(err => console.log(err))

    // Get saved and voted data
    let savedPost = await Post.find({ postType: 1 }).then(data => data.map(post => post.id))
    let votedPost = await Post.find({ postType: 2 }).then(data => data.map(post => post.id))

    savedPost = saved.filter(save => savedPost.indexOf(save) === -1)
    votedPost = voted.filter(vote => votedPost.indexOf(vote) === -1)
    return [savedPost, votedPost];
}

module.exports = performSyncUserData