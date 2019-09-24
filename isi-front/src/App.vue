<template>
  <v-app>
      <v-toolbar app>
      <v-toolbar-title class="headline">
        <v-layout>
          <img
              v-if="isAuth"
              :src="`${basePath}/img/logo.png`"
              :lazy-src="`${basePath}/img/logo.png`"
              alt="Лого"
              height="45px"
          />
          &nbsp;
          <div>
            <div v-if="isAuth">
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
        <v-progress-linear :indeterminate="true" v-if="loading > 0"/>
        <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import DateSelector from './components/DateSelector'
import Favico from 'favico.js'
export default {
    name: 'App',
    data: () => ({
        timerId: null
    }),
    computed: {
        waitingLeadsCount () {
            return this.$store.getters.waitingLeadsCount
        },
        tasks () {
            return this.$store.state.spinner.tasks
        },
        currentPage () {
            return this.$store.state.spinner.currentPage
        },
        loading () {
            return this.$store.getters.busy
        },
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
    watch: {
        waitingLeadsCount (val) {
            let favicon = new Favico({
                animation : 'popFade'
            })
            if (val) {
                if (this.timerId) {
                    WorkerGlobalScope.clearInterval(this.timerId)
                }
                favicon.badge(val)
                this.timerId = WorkerGlobalScope.setInterval(() => {
                    favicon.reset()
                    favicon.badge(val)
                }, 3000)
            } else {
                if (this.timerId) {
                    WorkerGlobalScope.clearInterval(this.timerId)
                }
                favicon.reset()
            }
        }
    },
    components: {
        DateSelector
    }
}
</script>
