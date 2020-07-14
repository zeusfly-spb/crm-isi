const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '>> '
})
const {query, serialize} = require('./orm')
const user = require('./models/user')
const handleCommand = async command => {
    if (['exit', 'quit', 'close', 'Exit', 'Close', 'Quit'].includes(command)) {
        console.log('Bue ...')
        readline.close()
        process.exit()
    }
    switch (command) {
        case 'clear':
            console.clear()
            readline.prompt()
            break
        case 'get-users':
            let users = await user.getUsers()
            let arr = Object.values(users)
            let model = arr[0]
            console.log(serialize(model))
            // console.log(users)
            readline.prompt()
            break
        default:
            query(command)
                .then(res => {
                    console.log(res)
                    readline.prompt()
                })
                .catch(e => {
                    console.error(e)
                    readline.prompt()
                })
            break
    }

}
readline.prompt()
readline.on('line', command => {
    handleCommand(command)
    readline.prompt()
})
