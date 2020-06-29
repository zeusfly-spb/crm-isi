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
    let cookies = req.headers.cookie.split(';')
    cookies = cookies.map(item => parseCookie(item))
    console.log(cookies)

    console.log('Connected from: ' + req.socket.remoteAddress)
    ws.on('message', message => {
        console.log(`Received message => ${message}`)
        console.log(ws)
        // broadcast('А теперь я говорю вам, здравствуйте!' + message)
    })
    ws.send('Connected')
})

exports.broadcast = broadcast
