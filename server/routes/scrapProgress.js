const router = require('express').Router();
const ScrapProgress = require('../model/ScrapProgress');

router.get('/', async (req, res) => {
    res.json(await ScrapProgress.findOne())
})

module.exports = router