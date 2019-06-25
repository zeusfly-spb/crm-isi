<template>
    <v-flex>
        <div class="blue-grey--text">Телефоны:</div>
        <div v-for="phone in customer.phones" :key="phone.id">
            {{ phone.number | phone }}
            <v-icon
                class="red--text"
                small
                @click="deletePhone(phone.id)"
                title="Удалить"
            >
                delete
            </v-icon>
        </div>
        <div v-if="!customer.phones.length" class="red--text">Нет телефонов</div>
        <v-text-field
            label="Номер"
            v-show="adding"
            v-model="newPhone"
            data-vv-as="Номер телефона"
            data-vv-name="phone"
            :error-messages="errors.collect('phone')"
            ref="newNumber"
        ></v-text-field>
        &nbsp;
        <v-icon
            class="green--text"
            small
            @click=""
            title="Сохранить"
            v-if="adding"
        >
            save
        </v-icon>

        <a href="#" @click="addModeOn" v-if="!adding" style="text-decoration: none">
            Добавить номер
        </a>

        <v-icon
            class="red--text"
            small
            @click="adding = false"
            title="Отмена"
            v-if="adding"
        >
            cancel
        </v-icon>


    </v-flex>
</template>
<script>
    export default {
        name: 'CustomerPhonesEditor',
        props: ['customer'],
        data: () => ({
            adding: false,
            newPhone: ''
        }),
        methods: {
            deletePhone (id) {
                let params = {customer_id: this.customer.id, phone_id: id}
                this.$store.dispatch('deleteCustomerPhone', params)
                    .then(() => this.customer.phones = this.customer.phones.filter(item => +item.id !== +id))
            },
            addModeOn () {
                this.adding = true
                this.$refs.newNumber.focus()
            }
        },
        filters: {
            phone: function (val) {
                return '+7 ' + val.replace(/[^0-9]/g, '')
                    .replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')
            }
        },
        updated () {
        }
    }
</script>
