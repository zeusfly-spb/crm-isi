<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline">
        <v-layout>
          <img
              :src="`${basePath}/img/logo.png`"
              :lazy-src="`${basePath}/img/logo.png`"
              alt="Лого"
              height="45px"
          />
          &nbsp;
          <div>
            <div>
              <span>Островки</span>
              <div class="title font-weight-bold">{{ authUser && authUser.full_name }}</div>
            </div>
          </div>
        </v-layout>




      </v-toolbar-title>
        <date-selector v-if="isAuth && ($store.getters.isAllowed || $store.state.access === 'allowed')"/>
        <v-spacer v-else></v-spacer>

    <v-btn v-if="isAuth" flat
           @click="logOut"
           title="Выход"
    >
        Выход &nbsp;
        <v-icon large color="orange darken-2">exit_to_app</v-icon>
    </v-btn>

    </v-toolbar>

    <v-content>
        <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import DateSelector from './components/DateSelector'

export default {
    name: 'App',
    data () {
        return {
          //
        }
    },
    computed: {
        basePath () {
            return this.$store.state.basePath
        },
      isAuth () {
          return this.$store.getters.isAuth
      },
      authUser () {
          return this.$store.state.authUser
      },
      accountingDate () {
          return this.$store.state.accountingDate
      }

    },
    methods: {
        logOut () {
            this.$store.dispatch('logOut')
            this.$router.push('/login')
        }
    },
    components: {
        DateSelector
    }
}
</script>
