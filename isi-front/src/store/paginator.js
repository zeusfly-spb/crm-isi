export default {
    state: {
        page: 1,
        per_page: 10,
        total: 0,
        last_page: 0,
        current_page: 0
    },
    actions: {
        updatePagination ({commit, dispatch}, data) {
            return new Promise((resolve, reject) => {
                commit('UPDATE_PAGINATION', data)
                dispatch('setLeadsOnTimer')
                    .then(res => resolve(res))
                    .catch(e => reject(e))
            })
        }
    },
    mutations: {
        SYNC_PAGINATION (state, sync) {
            state.total = sync.total
            state.last_page = sync.lastPage
            state.per_page = sync.perPage
            state.page = sync.currentPage
        },
        UPDATE_PAGINATION (state, data) {
            state.page = data.page || 1
            state.per_page = data.rowsPerPage || -1
        }
    },
    getters: {
        paginator_page: state => state.page,
        paginator_per_page: state => state.per_page
    }
}
