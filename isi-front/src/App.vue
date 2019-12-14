<template>
  <v-app>
      <v-toolbar app>
      <v-toolbar-title class="headline">
        <v-layout>
            <v-avatar
                      color="white"
                      style="box-shadow: black"
                      v-if="isAuth"
            >
                <img
                    v-if="isAuth && !authUser.is_superadmin && authUser.avatar"
                    :src="`${basePath}${authUser.avatar}`"
                    :lazy-src="`${basePath}${authUser.avatar}`"
                    alt="Лого"
                    height="45px"
                />
                <img
                    v-else
                    :src="`${basePath}/img/logo.png`"
                    :lazy-src="`${basePath}/img/logo.png`"
                    alt="Лого"
                    height="45px"
                />
            </v-avatar>
          &nbsp;
          <div>
            <div v-if="isAuth">
              <span>Островки</span>
              <div class="title font-weight-bold">
                  {{ authUser && authUser.full_name }}
                  <span v-if="access && access.island" class="blue--text">({{ access && access.island && access.island.name }})</span>
              </div>
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
                    <v-badge color="red"
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
                :src="`${basePath}/beep.wav`" autoplay
                v-if="beep"
            />
        </v-flex>
        <transition name="slide-right">
            <router-view/>
        </transition>
    </v-content>
  </v-app>
</template>

<script>
import DateSelector from './components/DateSelector'
import CallReminder from './components/leads/CallReminder'
import QueryInspector from './components/QueryInspector'
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
            {title: 'Зарплата', href: '/salary'},
            {title: 'Администрация', href: '/admin'}
        ]
    }),
    computed: {
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
        isSuperadmin () {
            return this.$store.getters.isSuperadmin
        },
        access () {
            return this.$store.state.access
        },
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
      },
        islands () {
            return this.$store.state.islands
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
    components: {
        DateSelector,
        CallReminder,
        QueryInspector
    }
}
</script>
