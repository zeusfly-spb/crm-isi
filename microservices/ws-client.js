const WebSocket = require('ws')
const connection = new WebSocket('http://crmkin.com:8118')

connection.onopen = () => {
    connection.send('token')
}

connection.onerror = (error) => {
    console.log(`WebSocket error: ${JSON.stringify(error)}`)
}

connection.onmessage = (e) => {
    console.log(e.data)
}
