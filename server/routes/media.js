const router = require('express').Router();
const { dirname } = require('path')
const rootPath = dirname(require.main.filename)

router.get('/video/:id/', async (req, res) => {
    const { id } = req.params
    let filePath = "video"
    let fileType = ".mp4"
    res.sendFile(`${rootPath}/public/${filePath}/${id}${fileType}`)
})

router.get('/image/:id', async (req, res) => {
    const { id } = req.params
    let filePath = "image"
    let fileType = ".jpg"
    res.sendFile(`${rootPath}/public/${filePath}/${id}${fileType}`)
})

module.exports = router