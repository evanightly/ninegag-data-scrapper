const unpackVotedSavedPost = () => {
    const [unpackedSaved, unpackedVoted] = [[], []]
    const storedPosts = JSON.parse(sessionStorage.getItem('posts'));
    let { saved, voted } = storedPosts
    saved = saved.map(s => s.map(obj => unpackedSaved.push(obj)))
    voted = voted.map(v => v.map(obj => unpackedVoted.push(obj)))
    return { unpackedSaved, unpackedVoted }
}
module.exports = unpackVotedSavedPost