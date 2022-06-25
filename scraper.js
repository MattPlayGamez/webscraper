async function scraper(url) {
    require('dotenv/config')
    // const shortid = require('shortid')
    // const id = shortid.generate()
    const puppeteer = require('puppeteer')
    const browser = await puppeteer.launch({
        headless: true,
        ignoreHTTPSErrors: true,
        args: [ '--no-sandbox' ]
    })
    const page = await browser.newPage()
    await page.goto(url, {
        waitUntil: 'networkidle0'
    })
    const content = await page.content()

    await browser.close()
    return content
}

module.exports = scraper