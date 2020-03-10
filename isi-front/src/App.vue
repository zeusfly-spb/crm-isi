<template>
  <v-app>
      <app-toolbar/>
      <v-content>
          <call-reminder/>
          <query-inspector/>
          <v-progress-linear :indeterminate="true" v-if="loading"/>
          <v-flex align-center row>
              <v-tabs
                  v-if="isAuth"
                  fixed-tabs
              >
                  <v-tab
                      v-for="(tab, index) in tabs"
                      :to="{path: tab.href, query: {... $route.query}}"
                      :key="index"
                      router
                  >
                      <v-badge
                          color="red"
                          v-if="tab.href === '/leads' && waitingLeadsCount"
                      >
                          <template v-slot:badge>
                              <span>{{ waitingLeadsCount }}</span>
                          </template>
                          {{ tab.title }}
                      </v-badge>
                      <span v-else>{{ tab.title }}</span>
                  </v-tab>
              </v-tabs>
              <audio
                  :src="`${basePath}/beep.wav`"
                  autoplay
                  v-if="beep"
              />
          </v-flex>
          <transition
              name="slide-right"
          >
              <router-view/>
          </transition>
      </v-content>
  </v-app>
</template>

<script>
import DateSelector from './components/DateSelector'
import CallReminder from './components/leads/CallReminder'
import QueryInspector from './components/QueryInspector'
import AppToolbar from './components/main/AppToolbar'
import $ from 'jquery'
export default {
    name: 'App',
    data: () => ({
        timerId: null,
        adminTabs: [
            {title: 'Учет на день', href: '/daily'},
            {title: 'База клиентов', href: '/customers' },
            {title: 'Склад', href: '/stock'},
            {title: 'Заявки', href: '/leads'},
            {title: 'Запись', href: '/appointments'},
            {title: 'Зарплата', href: '/salary'},
            {title: 'Администрация', href: '/admin'}
        ]
    }),
    computed: {
        workingIslandId () {
            return this.$store.state.workingIslandId
        },
        beep () {
            return this.$store.state.loader.beep
        },
        salaryVisible () {
            return this.$store.state.settings.data.salaryPage.visible
        },
        regularTabs () {
            return this.salaryVisible ? this.adminTabs.filter(item => item.href !== '/admin') : this.adminTabs.filter(item => item.href !== '/salary' && item.href !== '/admin')
        },
        tabs () {
            return this.isSuperadmin ? this.adminTabs : this.regularTabs
        },
        access () {
            return this.$store.state.access
        },
        waitingLeadsCount () {
            return this.$store.getters.waitingLeadsCount
        },
        loading () {
            return this.$store.getters.busy
        },
        isAuth () {
            return this.$store.getters.isAuth
        },
        authUser () {
            return this.$store.state.authUser
        }
    },
    methods: {
        logOut () {
            this.$store.dispatch('logOut')
            this.$router.push('/login')
        },
        showLeadsOnTitle () {
            let backupTitle = document.title
            if (this.timerId) {
                clearTimeout(this.timerId)
            }
            document.title = 'Непринятые заявки ' + this.waitingLeadsCount
            this.timerId = setTimeout(() => {
                document.title = backupTitle
            }, 1000)
        }
    },
    mounted () {
        setInterval(() => {
            if (this.waitingLeadsCount) {
                this.showLeadsOnTitle()
            }
        }, 2000)
    },
    created () {
        $(window).blur(function() {
            setInterval(() => {
                if (this.waitingLeadsCount) {
                    this.showLeadsOnTitle()
                }
            }, 2000)

        });
        $(window).focus(function() {
            setInterval(() => {
                if (this.waitingLeadsCount) {
                    this.showLeadsOnTitle()
                }
            }, 2000)
        });
    },
    watch: {
        workingIslandId (val, oldVal) {
            console.log(`Старое значение: ${oldVal}`)
            console.log(`Новое значение: ${val}`)
        },
        access (val) {
            let userIslandIds = this.authUser && this.authUser.islands.length && this.authUser.islands.map(item => item.id) || []
            if (val.status && val.status !== 'allowed' || !userIslandIds.includes(val.island_id) || !val) {
                this.$router.push({path: '/access', query: this.$route.query})
            }
        }
    },
    components: {
        DateSelector,
        CallReminder,
        QueryInspector,
        AppToolbar
    }
}
</script>
