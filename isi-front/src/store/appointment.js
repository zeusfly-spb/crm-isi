import Vue from 'vue'

export default {
    state: {
        addingCabinetId: null,
        addingHour: null,
        addingDate: null,
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
        },
        sortByDateTime: (a, b) => a.date < b.date ? -1 : a.date > b.date ? 1 : 0,
        splitEventTime: (event) => ({
            ...event,
            hour: +event.date.split(' ')[1].split(':')[0],
            minutes: +event.date.split(' ')[1].split(':')[1]
        })
    },
    actions: {
        changeEventStatus ({commit, rootState}, data) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/appointment_change_status', {
                    ...data,
                    user_id: rootState.authUser.id
                })
                    .then(res => {
                        commit('UPDATE_APPOINTMENT', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        moveEvent ({commit, state, rootState}) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/move_appointment', {
                    user_id: rootState.authUser.id,
                    event_id: state.draggedEvent.id,
                    cabinet_id: state.dragTarget.cabinet_id || null,
                    date: state.dragTarget.date,
                    hour: state.dragTarget.hour
                })
                    .then(res => {
                        let minutes = state.draggedEvent.date.split(' ')[1].split(':')[1]
                        let text = `Запись перенесена ${state.dragTarget.cabinet ? 'в кабинет' : ''} ${state.dragTarget.cabinet && state.dragTarget.cabinet.name || ''} на 
                        ${Vue.moment(state.dragTarget.date + ' ' + state.dragTarget.hour + ':' + minutes)
                            .format('D MMMM YYYY г. HH:mm')}`
                        commit('UPDATE_APPOINTMENT', res.data)
                        commit('SEND_EVENT_MESSAGE', {text: text, color: 'green'})
                        commit('UNSET_DRAG_EVENT')
                        commit('UNSET_DRAG_TARGET')
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
        UNSET_ADDING_CABINET_ID (state) {
            state.addingCabinetId = null
        },
        SET_ADDING_CABINET_ID (state, id) {
            state.addingCabinetId = id
        },
        UNSET_ADDING_HOUR (state) {
            state.addingHour = null
        },
        SET_ADDING_HOUR (state, hour) {
            state.addingHour = hour
        },
        SET_ADDING_DATE (state, date) {
            state.addingDate = date
        },
        SET_DRAG_EVENT (state, event) {
            state.draggedEvent = state.splitEventTime(event)
        },
        UNSET_DRAG_EVENT (state) {
            state.draggedEvent = null
        },
        SET_DRAG_TARGET (state, target) {
            state.dragTarget = target
        },
        UNSET_DRAG_TARGET (state) {
            state.dragTarget = null
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
    },
    getters: {
        moveReady: state => state.draggedEvent && state.dragTarget && (state.dragTarget.hour !== state.draggedEvent.hour || state.dragTarget.cabinet_id !== state.draggedEvent.cabinet_id),
        todayEvents: (state, getters, rootState) => state.appointments.filter(event => event.date.split(' ')[0] === rootState.realDate)
    }
}
