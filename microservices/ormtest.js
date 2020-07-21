const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '>> '
})
const {query, serialize} = require('./orm')
const user = require('./models/user')
const document_packs = require('./models/document_packs')
const handleCommand = async command => {
    if (['exit', 'quit', 'close', 'Exit', 'Close', 'Quit'].includes(command)) {
        console.log('Bue ...')
        readline.close()
        process.exit()
    }
    switch (command.split(' ')[0]) {
        case 'clear':
            console.clear()
            readline.prompt()
            break
        case 'get-users':
            let users = await user.getUsers()
            console.log(users)
            readline.prompt()
            break
        case 'find-document_pack':
            let document_pack_id = command.split(' ')[1]
            let document_pack = await document_packs.find(document_pack_id)
            console.log(document_pack)
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