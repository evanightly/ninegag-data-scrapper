const UserData = require("../../model/UserData")
const pageInitializer = require("./pageInitializer")
const CONFIG = require('../../config.json')
const { DOMAIN: NINEGAG_DOMAIN } = CONFIG.NINEGAG
const performGetUserData = async (browser) => {
    try {
        page = await pageInitializer(browser)
        const userData = await UserData.find({}).then(data => data[0])
        userData && await UserData.findByIdAndRemove(userData._id)
        await page.goto(NINEGAG_DOMAIN)
        // await page.waitForNavigation({ waitUntil: 'networkidle2' })
        // await page.screenshot({ path: "./screenshots/main.jpg" })

        const localStorage = await page.evaluate(() => JSON.parse(window.localStorage.userState).userInfo);
        await page.close()
        return localStorage
    } catch (error) {
        console.log("Your ip might be blocked by cloudflare at the moment, please try again later")
    }
}

module.exports = performGetUserData