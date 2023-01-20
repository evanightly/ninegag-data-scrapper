const UserData = require("../../model/UserData");
const Post = require("../../model/Post");
const performGetUserData = require("./performGetUserData");

const performSyncUserData = async (browser) => {
    // Upload user data from 9gag localstorage
    const localStorage = await performGetUserData(browser);
    const [saved, voted] = [localStorage.saves, Object.entries(localStorage.votes).filter(post => localStorage.votes[post[0]] === 1).map(v => v[0])]
    UserData.create({ saved, voted }).then(() => console.log("Userdata successfully uploaded!")).catch(err => console.log(err))
    // console.log("Localstorage", saved)

    // Get saved and voted data
    let savedPost = await Post.find({ postType: 1 }).then(data => data.map(post => post.id))
    let votedPost = await Post.find({ postType: 2 }).then(data => data.map(post => post.id))
    // console.log("Database", savedPost)
    savedPost = saved.filter(save => savedPost.indexOf(save) === -1)
    // console.log("SV", savedPost)
    votedPost = voted.filter(vote => votedPost.indexOf(vote) === -1)
    return [savedPost, votedPost];
}

module.exports = performSyncUserData