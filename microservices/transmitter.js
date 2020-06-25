const WebSocket = require('ws')
const wss = new WebSocket.Server({port: 8118})

const broadcast = data => {
    wss.clients.forEach(client => {
        client.readyState === WebSocket.OPEN ? client.send(data) : null
    })
}


wss.on('connection', ws => {
    ws.on('message', message => {
        console.log(`Received message => ${message}`)
        console.log(ws)
        // broadcast('А теперь я говорю вам, здравствуйте!' + message)
    })
    ws.send('Connected')
})

exports.broadcast = broadcast
