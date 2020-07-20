const orm = require('../orm')
const table = 'users'

const getUsers = async () => {
    try {
        let users = await orm.query(`SELECT * FROM ${table}`)
        let customDocs = await orm.query('SELECT * FROM custom_docs')
        let documentPacks = await orm.query(`SELECT * FROM document_packs`)

        documentPacks = documentPacks.map(dp => ({
            ...dp,
            custom_docs: customDocs.filter(cd => cd.document_pack_id === dp.id)
        }))
            .map(item => ({
                ...item,
                custom_docs: [...item.custom_docs]
            }))

        users = users.map(user => ({
            ...user,
            document_pack: documentPacks.find(dp => dp.user_id === user.id)
        }))
        return Promise.resolve(users)
    } catch (e) {
        return Promise.reject(e)
    }
}

module.exports = {
    getUsers: getUsers
}
