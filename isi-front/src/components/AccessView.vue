<template>
    <v-layout align-center justify-center row fill-height>
        <v-flex xs12 md3 class="grey lighten-4">
            <v-container class="text-xs-center">
                <v-card flat v-if="access === 'none'">
                    <v-card-title primary-title>
                        <h4 class="red--text">Доступ запрещен</h4>
                    </v-card-title>
                    <v-form>
                        <v-text-field prepend-icon="lock_open"
                                      label="Комментарий"
                                      v-model="comment"
                                      @keyup.enter="logIn"
                        ></v-text-field>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn primary @click="sendRequest">Запросить доступ</v-btn>
                        </v-card-actions>
                    </v-form>
                </v-card>
                <v-card flat v-if="access === 'requested'">
                    <div class="title">Запрос отправлен</div>
                    <div class="title red--text">Ожидайте получения доступа</div>
                </v-card>
            </v-container>
        </v-flex>

    </v-layout>
</template>

<script>
    export default {
        name: 'AccessView',
        data: () => ({
            comment: ''
        }),
        computed: {
            authUser () {
                return this.$store.state.authUser
            },
            access () {
                return this.$store.state.access
            }
        },
        methods: {
            sendRequest () {
                this.axios.post('/api/create_access_request', {
                    user_id: this.authUser.id,
                    comment: this.comment
                })
                    .then(res => {
                        this.$store.commit('SET_DEVICE_ID', res.data.device_id)
                        this.$store.dispatch('checkAccess')
                    })
            }
        },
        watch: {
            access (value) {
                if (value === 'requested') {
                    setInterval(() => this.$store.dispatch('checkAccess'), 5000)
                }
                if (value === 'allowed') this.$router.push('/home')
            }
        }
    }
</script>
