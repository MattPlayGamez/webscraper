//importing all modules
require('dotenv/config')
const cheerio = require('cheerio')
const scraper = require('./scraper')
const express = require('express')
const sendgrid = require('@sendgrid/mail')
const app = express()

sendgrid.setApiKey(process.env.SENDGRID_API_KEY)


app.use(express.json())
app.set('view-engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.post('/:id/:email/:maxprice', (req, res) => {
    const id = req.params.id
    const rawdecrypt = atob(id)
    const rawemail = req.params.email
    const email = atob(rawemail)
    const rawmaxprice = req.params.maxprice
    const maxpriceinpennies = Number(atob(rawmaxprice))
    const maxprice = maxpriceinpennies / 100
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
        res.send(encrypt)
        if (euros < maxprice) {
            sendMail(process.env.SENDGRID_FROM, email, euros, maxprice)
        }
        
    }).catch(err => console.error(err))
})

async function sendMail(from, to, euros, maxprice) {
    const mail = {
        from: from,
        to: to,
        subject: 'dropped price',
        text: 'The price has dropped to €' + euros + '\nWhich is under your max price of €' + maxprice
    }
    await sendgrid.send(mail)
}

app.listen(process.env.PORT)