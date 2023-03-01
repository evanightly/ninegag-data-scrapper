const router = require('express').Router();
const { dirname } = require('path');
const Note = require('../model/Note')

router.get('/', async (req, res) => res.json(await Note.findOne()))

router.post('/', async (req, res) => {
    const { note } = req.body
    const notes = await Note.findOneAndUpdate({}, { note }, { upsert: true, new: true })
    return res.json(notes)
})

module.exports = router