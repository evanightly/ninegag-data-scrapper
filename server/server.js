const UserData = require('./model/UserData')
const Post = require('./model/Post')

const puppeteer = require("puppeteer")
const mongoose = require('mongoose')
const express = require("express")
const cors = require("cors")
require("dotenv").config()
const fs = require("fs")

const app = express()
const CONFIG = require('./config.json')
const Tag = require('./model/Tag')
const post = require('./routes/post')
const tag = require('./routes/tag')

let browser
app
    .use(express.urlencoded({ extended: true }))
    .use(express.json())
    .use(cors())
    .use('/post', post)
    .use('/tag', tag)

const init = async () => {
    await mongoose.connect(CONFIG.MONGODB_CREDENTIALS.DB_URI)
        .then(() => console.log('Successfully connect to database'))
        .catch(error => console.log("Error when connecting to database, it might be service has stopped", error))
    browser = await puppeteer.launch({
        defaultViewport: null,
        headless: true,
    })
    app.locals.browser = browser
    console.log("Successfully launch headless window")
}

(async () => {
    await init()
})();


app.listen(1122, () => console.log(`Successfully started server in port 1122`));
