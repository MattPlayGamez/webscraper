//importing all modules
require('dotenv/config')
const cheerio = require('cheerio')
const scraper = require('./scraper')
const express = require('express')
const app = express()

app.use(express.json())
app.set('view-engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.post('/:id', (req, res) => {
    const id = req.params.id
    const rawdecrypt = atob(id)
    const decrypt = rawdecrypt.split('#')[0]
    scraper(decrypt).then(content => {
        const $ = cheerio.load(content)
        const rawprice = $('span.promo-price').text()
        const removelines = rawprice.replace('\n', '')
        const removespaces = removelines.replace('  ', '')
        const changedash = removespaces.replace('-', '00')
        const price = Number(changedash)
        const euros = price / 100
        const encrypt = btoa(euros)
        // const encrypt = btoa(euros)
        res.send(encrypt)
    }).catch(err => console.error(err))
})

app.listen(process.env.PORT)