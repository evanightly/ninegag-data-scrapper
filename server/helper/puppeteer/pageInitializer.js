const { PUPPETEER } = require('../../config.json')
const { WINDOW, USER_AGENT, DEFAULT_NAVIGATION_TIMEOUT } = PUPPETEER.HEADLESS
const { WIDTH, HEIGHT } = WINDOW
const pageInitializer = async (browser) => {
    const page = await browser?.newPage()
    await page.setViewport({ width: WIDTH, height: HEIGHT })
    await page.setUserAgent(USER_AGENT);
    await page.setDefaultNavigationTimeout(DEFAULT_NAVIGATION_TIMEOUT)
    return page
}

module.exports = pageInitializer