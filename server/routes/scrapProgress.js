const router = require('express').Router();
const ScrapProgress = require('../model/ScrapProgress');

router.get('/', async (req, res) => {
    res.json(await ScrapProgress.findOne())
})

router.get('/clear', async (req, res) => {
    res.json(await ScrapProgress.remove())
})

module.exports = router