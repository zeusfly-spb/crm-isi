<template>
        <v-layout align-center justify-center row fill-height>
            <v-snackbar
                v-model="snackbar"
                auto-height
                top
                :timeout="3000"
                :color="snackColor"
            >
                <span>{{ snackText }}</span>
            </v-snackbar>

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
                            ></v-text-field>
                            <span class="red--text">{{ errors.first('name') }}</span>

                            <v-text-field prepend-icon="lock" name="password" label="Пароль" type="password"
                                          v-model="password"
                                          @keyup.enter="logIn"
                                          v-validate="'required'"
                                          data-vv-as="«Пароль»"
                            ></v-text-field>
                            <span class="red--text">{{ errors.first('password') }}</span>

                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn primary @click="logIn">ВХОД</v-btn>
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
            snackbar: false,
            snackColor: 'red',
            snackText: 'Ошибка авторизации! Проверьте правильность учетных данных.',
            name: '',
            email: '',
            password: ''
        }),
        methods: {
            showError () {
                this.snackbar = true
            },
            logIn () {
                this.$validator.validate()
                    .then((valid) => {
                        if (!valid) return
                        this.$store.dispatch('logIn', {name: this.name, password: this.password})
                            .then(() => {
                                this.$store.dispatch('setAuthUser')
                                this.$store.dispatch('checkAccess')
                                        .then(() => {
                                            if (this.$store.getters.isAllowed || this.$store.state.access === 'allowed') {
                                                this.$store.dispatch('setAccountingDate')
                                                this.$store.dispatch('setUsers')
                                                this.$store.dispatch('setGroups')

                                                this.$router.push('/home')
                                            } else {
                                                this.$store.dispatch('checkAccess')

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
        }
    }
</script>
