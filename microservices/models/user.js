const orm = require('../orm')
const table = 'users'

const getUsers = async () => {
    try {
        let users = await orm.query(`SELECT * FROM ${table}`)
        let customDocs = await orm.query('SELECT * FROM custom_docs')
        let documentPacks = await orm.query(`SELECT * FROM document_packs`)
        let islands = await orm.query('SELECT * FROM islands')
        let islandUser = await orm.query('SELECT * FROM island_user')

        const userIslands = user => {
            let pivots = islandUser
                .filter(pivot => pivot.user_id === user.id)
                .map(item => item.island_id)
                .map(id => islands.find(island => island.id === id))
            return pivots
        }

        documentPacks = documentPacks.map(dp => ({
            ...dp,
            custom_docs: JSON.stringify(customDocs.filter(cd => cd.document_pack_id === dp.id))
        }))
        users = users.map(user => ({
            ...user,
            document_pack: documentPacks.find(dp => dp.user_id === user.id),
            islands: userIslands(user)
        }))
        return Promise.resolve(users)
    } catch (e) {
        return Promise.reject(e)
    }
}

module.exports = {
    getUsers: getUsers
}
