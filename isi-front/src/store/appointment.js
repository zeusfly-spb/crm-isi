import Vue from 'vue'

export default {
    state: {
        date: null,
        mode: 'month',
        appointments: []
    },
    actions: {
        changeAppointmentDate ({dispatch, commit, state}, date) {
            let mustUpdate = state.date.split('-')[1] !== date.split('-')[1]
            commit('SET_APPOINTMENT_DATE', date)
            if (mustUpdate) {
                dispatch('setAppointments')
            }
        },
        deleteAppointment ({commit}, data) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/delete_appointment', {... data})
                    .then(res => {
                        commit('DELETE_APPOINTMENT', data.id)
                        resolve(res)
                    })
                    .catch(e => reject(e))

            })
        },
        updateAppointment ({commit}, data) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/update_appointment', {... data})
                    .then(res => {
                        commit('UPDATE_APPOINTMENT', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        createAppointment ({commit}, data) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/create_appointment', {... data})
                    .then(res => {
                        commit('ADD_APPOINTMENT', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        setAppointments ({commit, rootState, state}) {
            return new Promise((resolve, reject) => {
                commit('ADD_TASK', 'appointments')
                Vue.axios.post('/api/get_appointments', {
                    date: state.date,
                    island_id: rootState.workingIslandId
                })
                    .then(res => {
                        commit('SET_APPOINTMENTS', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
                    .finally(() => commit('REMOVE_TASK', 'appointments'))
            })
        }
    },
    mutations: {
        SET_APPOINTMENT_DATE (state, date) {
            state.date = date
        },
        SET_APPOINTMENT_MODE (state, mode) {
            state.mode = mode
        },
        DELETE_APPOINTMENT (state, id) {
            state.appointments = state.appointments.filter(item => +item.id !== +id)
        },
        UPDATE_APPOINTMENT (state, appointment) {
            state.appointments = state.appointments.map(item => +item.id === +appointment.id ? appointment : item)
        },
        ADD_APPOINTMENT (state, appointment) {
            state.appointments.push(appointment)
        },
        SET_APPOINTMENTS (state, appointments) {
            state.appointments = appointments
        }
    }
}
