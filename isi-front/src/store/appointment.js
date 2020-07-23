import Vue from 'vue'

export default {
    state: {
        eventToDone: null,
        eventDoneConfirm: false,
        activeCabinetId: null,
        tabMode: false,
        openCabinetWidth: 1400,
        openCabinetId: null,
        archiveCommentsLoading: false,
        archiveCommentsOpenId: null,
        displayedEvent: null,
        editedEvent: null,
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
        }),
        statusColor: status => {
            const colors = {
                active: 'blue',
                postponed: 'orange',
                moderate: 'amber',
                cancelled: 'red',
                completed: 'green'
            }
            if (!status) {
                return 'grey lighten-1'
            }
            return colors[status]
        },
        statusIcon: status => {
            const icons = {
                active: 'event',
                postponed: 'timelapse',
                moderate: 'assignment_late',
                cancelled: 'event_busy',
                completed: 'event_available'
            }
            if (!status) {
                return 'event'
            }
            return icons[status]
        }
    },
    actions: {
        setTabMode ({commit, getters}, val) {
            commit('SET_TAB_MODE', val)
            let island = getters.callCenter ? getters.inspectingIsland : getters.workingIsland
            let hasCabinets = island && island.cabinets && island.cabinets.length || false
            if (val && hasCabinets) {
                commit('SET_ACTIVE_CABINET_ID', island.cabinets[0].id)
            }
        },
        deleteEventComment ({commit, dispatch}, data) {
            return new Promise((resolve, reject) => {
                commit('SET_ARCHIVE_COMMENTS_LOADING', true)
                Vue.axios.post('/api/delete_appointment_comment', {... data})
                    .then(res => {
                        commit('UPDATE_APPOINTMENT', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
                    .finally(() => commit('SET_ARCHIVE_COMMENTS_LOADING', false))
            })
        },
        addEventComment ({dispatch, commit, rootState}, data) {
            return new Promise((resolve, reject) => {
                commit('SET_ARCHIVE_COMMENTS_LOADING', true)
                Vue.axios.post('/api/add_appointment_comment', {
                    ...data,
                    user_id: rootState.authUser.id
                })
                    .then(res => {
                        commit('UPDATE_APPOINTMENT', res.data)
                        if (res.data.subscribe_id) {
                            dispatch('setSubscribes')
                        }
                        resolve(res)
                    })
                    .catch(e => reject(e))
                    .finally(() => commit('SET_ARCHIVE_COMMENTS_LOADING',  false))
            })
        },
        changeEventStatus ({commit, rootState, dispatch}, data) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/appointment_change_status', {
                    ...data,
                    user_id: rootState.authUser.id
                })
                    .then(res => {
                        commit('UPDATE_APPOINTMENT', res.data)
                        if (res.data.subscribe_id) {
                            dispatch('setSubscribes')
                        }
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        moveEvent ({commit, state, rootState, dispatch}) {
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
                        if (res.data.subscribe_id) {
                            dispatch('setSubscribes')
                        }
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
                        dispatch('setSubscribes')
                    }
                } catch (e) {
                    reject (e)
                }
            })
        },
        deleteAppointment ({commit, dispatch}, data) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/delete_appointment', {... data})
                    .then(res => {
                        commit('DELETE_APPOINTMENT', data.id)
                        if (res.data.with_subscribe) {
                            dispatch('setSubscribes')
                        }
                        resolve(res)
                    })
                    .catch(e => reject(e))

            })
        },
        updateAppointment ({commit, dispatch}, data) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/update_appointment', {... data})
                    .then(res => {
                        commit('UPDATE_APPOINTMENT', res.data)
                        if (res.data.subscribe_id) {
                            dispatch('setSubscribes')
                        }
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        createAppointment ({commit, dispatch}, data) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/create_appointment', {... data})
                    .then(res => {
                        // commit('ADD_APPOINTMENT', res.data)
                        dispatch('pushFrame', {
                            type: 'add_appointment',
                            model: res.data
                        })
                        if (res.data.subscribe_id) {
                            dispatch('setSubscribes')
                        }
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        setAppointments ({commit, rootState, state, getters}) {
            return new Promise((resolve, reject) => {
                commit('ADD_TASK', 'appointments')
                Vue.axios.post('/api/get_appointments', {
                    date: state.date,
                    island_id: getters.callCenter ? getters.inspectingIslandId : rootState.workingIslandId
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
        SET_EVENT_TO_DONE (state, event) {
            state.eventToDone = event
        },
        SET_EVENT_DONE_CONFIRM (state, value) {
            state.eventDoneConfirm = value
        },
        SET_ACTIVE_CABINET_ID (state, id) {
            state.activeCabinetId = id
        },
        SET_TAB_MODE (state, val) {
            state.tabMode = val
        },
        SET_OPEN_CABINET_ID (state, id) {
            state.openCabinetId = id
        },
        SET_ARCHIVE_COMMENTS_LOADING (state, val) {
            state.archiveCommentsLoading = val
        },
        SET_ARCHIVE_COMMENTS_OPEN_ID (state, id) {
            state.archiveCommentsOpenId = id
        },
        UNSET_DISPLAYED_EVENT (state) {
            state.displayedEvent = null
            state.openCabinetId = null
        },
        SET_DISPLAYED_EVENT (state, event) {
            state.displayedEvent = event
            state.openCabinetId = event.cabinet_id
        },
        SET_EDITED_EVENT (state, event) {
            state.editedEvent = event
        },
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
        commentsOpenEvent: state => state.appointments.find(item => item.id === state.archiveCommentsOpenId),
        eventStatusIcon: state => state.statusIcon,
        eventStatusColor: state => state.statusColor,
        moveReady: state => state.draggedEvent && state.dragTarget && (state.dragTarget.hour !== state.draggedEvent.hour || state.dragTarget.cabinet_id !== state.draggedEvent.cabinet_id),
        todayEvents: (state, getters, rootState) => state.appointments.filter(event => event.date.split(' ')[0] === rootState.realDate),
        eventsDate: state => state.date
    }
}
