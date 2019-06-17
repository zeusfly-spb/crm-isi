<template>
        <v-layout align-center justify-center row fill-height>

            <v-flex xs3 class="grey lighten-4">
                <v-container class="text-xs-center">
                    <v-card flat>
                        <v-card-title primary-title>
                            <h4>Вход</h4>
                        </v-card-title>
                        <v-form>
                            <v-text-field prepend-icon="person" name="Username" label="Имя пользователя"
                                          v-model="email"
                            ></v-text-field>
                            <v-text-field prepend-icon="email" name="Email" label="E@mail"
                                          v-model="email"
                            ></v-text-field>
                            <v-text-field prepend-icon="lock" name="Password" label="Пароль" type="password"
                                          v-model="password"
                            ></v-text-field>
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
            name: '',
            email: '',
            password: ''
        }),
        methods: {
            logIn () {
                this.$store.dispatch('logIn', {email: this.email, password: this.password})
                    .then(() => {
                        this.$router.push('/home')
                    })
                    .catch(() => this.email = this.password = '')
            }
        }
    }
</script>
