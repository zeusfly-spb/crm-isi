const passport = require('./passport')
const fs = require('fs')
const options = {
    key: fs.readFileSync('/var/www/httpd-cert/www-root/crmkin.com.key'),
    cert: fs.readFileSync('/var/www/httpd-cert/www-root/crmkin.com.crt')
}


const {createServer} = require('https')
const {createServerFrom} = require('wss')
const https = createServer(options)

const wss = createServerFrom(https, ws => {
    ws.on('message', message => {
        console.log(`Received message => ${message}`)
        broadcast(message)
    })
})
https.listen(8118)


wss.on('connection', ws => {
    const parseCookie = str => {
        return {
            key: str.split('=')[0],
            value: str.split('=')[1]
        }
    }
    if (!ws.upgradeReq.headers.cookie) {
        ws.send('Access denied')
        ws.close()
    } else {
        let cookies = ws.upgradeReq.headers.cookie.split(';')
        cookies = cookies.map(item => parseCookie(item))
        !passport.verifyToken(cookies) ? ws.close() : console.log('Connected')
    }
})


const broadcast = data => {
    wss.clients.forEach(client => {
        client.readyState === 1 ? client.send(data) : null
    })
    console.log(`Delivered to ${[... wss.clients].filter(client => client.readyState === 1).length} clients`)
}




exports.broadcast = broadcast
