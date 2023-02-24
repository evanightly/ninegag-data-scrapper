const puppeteer = require("puppeteer")
const mongoose = require('mongoose')
const express = require("express")
const cors = require("cors")
require("dotenv").config()


const app = express()
const CONFIG = require('./config.json')
const post = require('./routes/post')
const tag = require('./routes/tag')
const media = require('./routes/media')
const scrapProgress = require('./routes/scrapProgress')

let browser
app
    .use(express.urlencoded({ extended: true }))
    .use(express.json())
    .use(cors())
    .use('/post', post)
    .use('/tag', tag)
    .use('/media', media)
    .use('/scrap-progress', scrapProgress)

const init = async () => {
    mongoose.set('strictQuery', true)
    await mongoose.connect(CONFIG.MONGODB_CREDENTIALS.DB_URI, { serverSelectionTimeoutMS: 1000 })
        .then(() => console.log('Connected to database'))
        .catch(error => console.log("Error when connecting to database, it might be service has stopped", error))
    browser = await puppeteer.launch({
        defaultViewport: null,
        headless: true,
    })
    app.locals.browser = browser
    console.log("Headless window launched")
}

(async () => {
    await init()
})();

app.listen(1122, () => console.log(`Server started in port 1122`));
