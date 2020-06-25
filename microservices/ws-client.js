const WebSocket = require('ws')
const connection = new WebSocket('http://localhost:8118')

connection.onopen = () => {
    connection.send('token')
}

connection.onerror = (error) => {
    console.log(`WebSocket error: ${error}`)
}

connection.onmessage = (e) => {
    console.log(e.data)
}
