<template>
        <v-layout align-center justify-center row fill-height>
            <v-flex xs12 md3 class="grey lighten-4">
                <v-container class="text-xs-center">
                    <v-card flat>
                        <v-card-title primary-title>
                            <h4>Вход</h4>
                        </v-card-title>
                        <v-form>
                            <v-text-field prepend-icon="person" name="name" label="Имя пользователя"
                                          v-model="name"
                                          @keyup.enter="logIn"
                                          v-validate="'required'"
                                          data-vv-as="«Логин»"
                            />
                            <span class="red--text">{{ errors.first('name') }}</span>

                            <v-text-field prepend-icon="lock" name="password" label="Пароль" type="password"
                                          v-model="password"
                                          @keyup.enter="logIn"
                                          v-validate="'required'"
                                          data-vv-as="«Пароль»"
                            />
                            <span class="red--text subtitle-2">
                                {{ errors.first('password') }}
                            </span>
                            <v-card-actions>
                                <v-spacer/>
                                <v-btn
                                    primary
                                    @click="logIn"
                                >
                                    ВХОД
                                </v-btn>
                            </v-card-actions>
                        </v-form>
                    </v-card>
                </v-container>
            </v-flex>

        </v-layout>
</template>
<script>
    export default {
        data: () => ({
            name: '',
            email: '',
            password: ''
        }),
        methods: {
            showError () {
                this.$store.dispatch('pushMessage', {
                    text: 'Ошибка авторизации! Проверьте правильность учетных данных.',
                    color: 'red'
                })
            },
            logIn () {
                this.$validator.validate()
                    .then((valid) => {
                        if (!valid) return
                        this.$store.dispatch('logIn', {name: this.name, password: this.password})
                            .then(() => {
                                this.$store.dispatch('setAuthUser')
                                    .then(() => {
                                        this.$store.dispatch('checkAccess')
                                    })
                                        .then(() => {
                                            if (this.$store.getters.isAllowed || this.$store.state.access === 'allowed') {
                                                this.$store.dispatch('enterCRM')
                                                    .then(() => this.$router.push('/daily'))
                                            } else {
                                                this.$router.push('/access')
                                            }
                                        })

                            })
                            .catch(() => {
                                this.showError()
                                this.email = this.password = ''
                            })
                    })

            }
        },
        beforeMount() {
            if (this.$store.getters.isAuth) {
                this.$router.push('/daily')
            }
        }
    }
</script>
