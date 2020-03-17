<template>
  <v-app>
      <side-panel/>
      <app-toolbar/>
      <v-content>
          <messages-panel/>
          <call-reminder/>
          <query-inspector/>
          <v-progress-linear :indeterminate="true" v-if="loading"/>
          <app-menu/>
          <router-view/>
      </v-content>
  </v-app>
</template>

<script>
import CallReminder from './components/leads/CallReminder'
import QueryInspector from './components/QueryInspector'
import AppToolbar from './components/main/AppToolbar'
import AppMenu from './components/main/AppMenu'
import SidePanel from './components/main/SidePanel'
import MessagesPanel from './components/main/MessagesPanel'
import $ from 'jquery'
export default {
    name: 'App',
    data: () => ({
        timerId: null
    }),
    computed: {
        access () {
            return this.$store.state.access
        },
        loading () {
            return this.$store.getters.busy
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
        access (val) {
            let userIslandIds = this.authUser && this.authUser.islands.length && this.authUser.islands.map(item => item.id) || []
            if (val.status && val.status !== 'allowed' || !userIslandIds.includes(val.island_id) || !val) {
                this.$router.push({path: '/access', query: this.$route.query})
            }
        }
    },
    components: {
        CallReminder,
        QueryInspector,
        AppToolbar,
        AppMenu,
        SidePanel,
        MessagesPanel
    }
}
</script>
