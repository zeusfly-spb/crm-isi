import Vue from 'vue'

export default {
    state: {
        eventReminderOptions: [
            {value: null, title: 'Не напоминать'},
            {value: 'morning', title: 'В начале дня'},
            {value: 120, title: 'За два часа'},
            {value: 60, title: 'За час'}
        ]
    }
}
