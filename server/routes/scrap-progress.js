const router = require('express').Router();
const ScrapProgress = require('../model/ScrapProgress');

router.get('/', async (req, res) => res.json(await ScrapProgress.findOne()))

router.get('/test', (_, res) => res.send('test'))

router.get('/clear', async (req, res) => res.json(await ScrapProgress.deleteMany()))

module.exports = router