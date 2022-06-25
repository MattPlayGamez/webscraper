//importing all modules
require('dotenv/config')
const cheerio = require('cheerio')
const scraper = require('./scraper')

const url = 'https://www.bol.com/nl/nl/p/asus-tuf-gaming-f17-fx706heb-hx114t-gaming-laptop-17-3-inch-144-hz/9300000047872025/?s2a='

scraper(url).then(content => {
    const $ = cheerio.load(content)
    const rawprice = $('span.promo-price').text()
    const removelines = rawprice.replace('\n', '')
    const removespaces = removelines.replace('  ', '')
    const changedash = removespaces.replace('-', '00')
    const price = Number(changedash)
    const euros = price / 100
    console.log('It costs €' + euros)
}).catch(err => console.error(err))