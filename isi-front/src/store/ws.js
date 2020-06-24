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
            const deleteLead = lead => commit('DELETE_LEAD', lead)
            const updateLead = lead => commit('UPDATE_LEAD', lead)

            const handleLead = event => {
                if (event.type === 'INSERT' && event.affectedRows[0].after) {
                    insertLead(event.affectedRows[0].after)
                }
                if (event.type === 'UPDATE' && event.affectedRows[0].after) {
                    console.log('Updating')
                    console.dir(event.affectedRows[0].after)
                    updateLead(event.affectedRows[0].after)
                }
                if (event.type === 'DELETE' && event.affectedRows[0].before) {
                    deleteLead(event.affectedRows[0].before)
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
