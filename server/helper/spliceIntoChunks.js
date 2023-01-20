const spliceIntoChunks = (arr, chunkSize) => {
    const res = []
    while (arr.length > 0) res.push(arr.splice(0, chunkSize))
    return res
};

module.exports = spliceIntoChunks