const CONFIG = require('../../config.json')
const pageInitializer = require('./pageInitializer')

const performLogin = async (browser) => {
    try {
        const { SELECTORS, USER_CREDENTIALS, NINEGAG } = CONFIG
        const { LOGIN } = SELECTORS
        const { LOGIN_DOMAIN } = NINEGAG
        page = await pageInitializer(browser)
        await page.goto(LOGIN_DOMAIN)
        await page.type(LOGIN.FIELD_USERNAME, USER_CREDENTIALS.USERNAME_OR_EMAIL)
        await page.type(LOGIN.FIELD_PASSWORD, USER_CREDENTIALS.PASSWORD)
        await page.click(LOGIN.BUTTON_LOGIN)
        await page.waitForNavigation({ waitUntil: 'networkidle2' })
        await page.close()
    } catch (error) {
        console.log("Your ip might be blocked by cloudflare at the moment, please try again later", error)
    }
}

module.exports = performLogin