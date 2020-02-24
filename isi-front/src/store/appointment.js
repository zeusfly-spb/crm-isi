import Vue from 'vue'

export default {
    state: {
        dragTarget: null,
        draggedEvent: null,
        eventToDelete: null,
        dialogLocked: false,
        deleteMode: false,
        message: null,
        date: null,
        mode: 'month',
        appointments: [],
        uniqID: (base) => base + '_' + Math.random().toString(36).substr(2, 9),
        displayTime: (fullTime) => {
            let timeArr = fullTime.split(':')
            if (timeArr.length === 3) {
                timeArr.pop()
                return timeArr.join(':')
            } else {
                return fullTime
            }
        }
    },
    actions: {
        moveEvent ({commit}, data) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/move_appointment', {... data})
                    .then(res => {
                        commit('UPDATE_APPOINTMENT', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        changeAppointmentDate ({dispatch, commit, state}, date) {
            return new Promise((resolve, reject) => {
                try {
                    let mustUpdate = state.date.split('-')[1] !== date.split('-')[1]
                    commit('SET_APPOINTMENT_DATE', date)
                    if (mustUpdate) {
                        dispatch('setAppointments')
                    }
                } catch (e) {
                    reject (e)
                }
            })
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
        SET_DRAG_TARGET (state, target) {
            state.dragTarget = target
        },
        START_DRAG_EVENT (state, event) {
            state.draggedEvent = event
        },
        END_DRAG_EVENT (state) {
            state.draggedEvent = null
        },
        CANCEL_DELETE_EVENT (state) {
            state.eventToDelete = null
        },
        ATTEMPT_TO_DELETE_EVENT (state, event) {
            state.eventToDelete = event
        },
        UNLOCK_DIALOG (state) {
            state.dialogLocked = false
        },
        LOCK_DIALOG (state) {
            state.dialogLocked = true
        },
        DELETE_MODE_OFF (state) {
            state.deleteMode = false
        },
        DELETE_MODE_ON (state) {
            state.deleteMode = true
        },
        SEND_EVENT_MESSAGE (state, message) {
            state.message = message
            setTimeout(() => state.message = null, 100)
        },
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
