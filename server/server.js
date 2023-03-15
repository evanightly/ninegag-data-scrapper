const puppeteer = require("puppeteer")
const mongoose = require('mongoose')
const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const fs = require('fs')

const CONFIG = require('./config.json')
const app = express()
dotenv.config()
let browser

app
    .use(express.urlencoded({ extended: true }))
    .use(express.json())
    .use(cors());

(async () => {

    // Dynamically import routes
    const routes = fs.readdirSync('./routes').filter(route => route.endsWith('.js'))
    for (const route of routes) {
        const baseRoute = `/${route.match(/(.*).js/)[1]}`
        app.use(baseRoute, require(`./routes/${route}`))
    }

    // Suppress mongoose warning
    mongoose.set('strictQuery', true)

    // Connect to database
    await mongoose
        .connect(CONFIG.MONGODB_CREDENTIALS.DB_URI, { serverSelectionTimeoutMS: 1000 })
        .then(() => console.log('Connected to database'))
        .catch(err => console.log("Error when connecting to database, it might be service has stopped", err))

    // Launch headless browser
    browser = await puppeteer.launch({ defaultViewport: null, headless: true })

    // Assigning browser to global object
    app.locals.browser = browser

    console.log("Headless window launched")
})()

app.listen(1122, () => console.log(`Server started in port 1122`));
