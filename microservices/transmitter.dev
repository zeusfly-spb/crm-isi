const passport = require('./passport')
const WebSocket = require('ws')
const wss = new WebSocket.Server({port: 8118})

const broadcast = data => {
    wss.clients.forEach(client => {
        client.readyState === WebSocket.OPEN ? client.send(data) : null
    })
}


wss.on('connection', (ws, req) => {
    const parseCookie = str => {
        return {
            key: str.split('=')[0],
            value: str.split('=')[1]
        }
    }
    if (!req || !req.headers || !req.headers.cookie) {
        ws.send('Access denied')
        ws.close()
    } else {
        let cookies = req.headers.cookie.split(';')
        cookies = cookies.map(item => parseCookie(item))
        !passport.verifyToken(cookies) ? ws.close() : console.log('Connected from: ' + req.socket.remoteAddress)
    }

    ws.on('message', message => {
        console.log(`Received message => ${message}`)
        broadcast(message)
    })
    // ws.send('Connected')
})

exports.broadcast = broadcast
