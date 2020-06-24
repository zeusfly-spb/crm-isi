const isJson = str => {
    try {
        JSON.parse(str)
    } catch (e) {
        return false
    }
    return true
}



export default {
    actions: {
        handleSqlEvent ({commit}, event) {
            const insertLead = lead => commit('ADD_LEAD', lead)

            const handleLead = event => {
                if (event.type === 'INSERT' && event.affectedRows[0].after) {
                    insertLead(event.affectedRows[0].after)
                }
            }

            const parseEvent = event => {
                switch (event.table) {
                    case 'leads':
                        handleLead(event)
                        break
                }
            }

            if (event.data && isJson(event.data)) {
                parseEvent(JSON.parse(event.data))
            }
        }
    }
}
