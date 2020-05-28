<template>
  <q-layout view="lHr LpR lFr">
    <!-- Header -->
    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-btn dense round icon="menu" behavior="mobile" @click="rightDrawer = !rightDrawer" />

        <q-toolbar-title>
          <q-btn to="/" class="q-ma-md">
              <q-icon name="home" /> {{ appName }}
          </q-btn>
        </q-toolbar-title>

        <locale-dropdown />
        <!-- <q-btn dense round icon="menu" @click="leftDrawerOpen = !leftDrawerOpen"/> -->
      </q-toolbar>
    </q-header>
    <!-- Header End -->

    <!-- Drawer -->
    <!-- <q-drawer
      v-model="leftDrawerOpen"
      side="right"
      behavior="mobile"
      bordered
      content-class="bg-grey-2"
    >
    </q-drawer> -->

    <q-drawer
      show-if-above
      v-model="rightDrawer"
      bordered
      content-class="bg-grey-2"
    >
      <q-img class="absolute-top" src="https://cdn.quasar.dev/img/material.png" style="height: 150px">
        <div class="absolute-bottom bg-transparent text-center">
          <template v-if="user">
            <q-avatar size="70px" class="*q-mb-sm">
              <img :src="avatar">
            </q-avatar><!-- TagAvatar: UserModule -->
            <div class="text-weight-bold">
              <q-btn-dropdown
                rounded
                :label="user.name"
                @click.prevent="authDrawer = !authDrawer"
              >
              </q-btn-dropdown>
            </div>
            <div>{{ user.email }}</div>
          </template>
        </div>
      </q-img>
      <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">
        <q-list v-if='authDrawer'>
          <q-item clickable tag="a" target="_blank" href="https://quasar.dev">
            <q-item-section avatar>
              <q-icon name="school" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Docs</q-item-label>
              <q-item-label caption>quasar.dev</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable tag="a" target="_blank" href="https://github.quasar.dev">
            <q-item-section avatar>
              <q-icon name="code" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Github</q-item-label>
              <q-item-label caption>github.com/quasarframework</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable tag="a" target="_blank" href="https://chat.quasar.dev">
            <q-item-section avatar>
              <q-icon name="chat" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Discord Chat Channel</q-item-label>
              <q-item-label caption>chat.quasar.dev</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable tag="a" target="_blank" href="https://forum.quasar.dev">
            <q-item-section avatar>
              <q-icon name="record_voice_over" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Forum</q-item-label>
              <q-item-label caption>forum.quasar.dev</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable tag="a" target="_blank" href="https://twitter.quasar.dev">
            <q-item-section avatar>
              <q-icon name="rss_feed" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Twitter</q-item-label>
              <q-item-label caption>@quasarframework</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable tag="a" target="_blank" href="https://facebook.quasar.dev">
            <q-item-section avatar>
              <q-icon name="public" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Facebook</q-item-label>
              <q-item-label caption>@QuasarFramework</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <q-list v-else>
          <q-item clickable to='/profile'>
            <q-item-section avatar>
              <q-icon name="person" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{$t('profile')}}</q-item-label>
              <q-item-label caption>{{user.role}}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-if="admins || sellers" to='/users'><!-- Admins and Sellers View ====-->
            <q-item-section avatar>
              <q-icon name="people" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{$t('users')}}</q-item-label>
              <q-item-label caption>{{user.role}}'s Users</q-item-label>
            </q-item-section>
          </q-item><!--============================================== Admins and Sellers View End -->
          <q-item clickable v-if="admins" to='/analytics'><!--======= Admins View ================-->
            <q-item-section avatar>
              <q-icon name="assessment" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{$t('analytics')}}</q-item-label>
              <q-item-label caption>{{user.role}}'s Analytics</q-item-label>
            </q-item-section>
          </q-item><!--============================================== Admins View End ============-->
          <q-item clickable :to="{name: 'auth.test'}">
            <q-item-section avatar>
              <q-icon name="check_circle_outline" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Test</q-item-label>
              <q-item-label caption>@CheckCode</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <div v-if="user" class="q-pa-md"><!-- Authenticated ====-->
          <q-btn icon="lock_open" :label="$t('logout')" @click.prevent="logout" />
        </div><!--=========================== Authenticated End -->
        <div v-else class="q-pa-md"><!--===== Guest ============-->
          <q-btn icon="vpn_key" :label="$t('login')" :to="{name: 'public.login'}" />
          <q-btn icon="add_to_queue" :label="$t('register')" :to="{name: 'public.register'}" />
        </div><!--=========================== Guest End ========-->
      </q-scroll-area>
    </q-drawer>
    <!-- Drawer End -->

    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- Footer -->
    <q-footer elevated v-if="desktop">
      <q-toolbar><!-- Desktop View -->
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg">
          </q-avatar>
          Quasar v{{ $q.version }} Desktop View
        </q-toolbar-title>
        <!-- <q-btn type="a" target="_blank" glossy unelevated href="https://www.patreon.com/modemb">
            <i class="fab fa-patreon fa-2x"/>
        </q-btn> -->
      </q-toolbar>
    </q-footer>
    <q-footer elevated v-else>
      <q-toolbar><!-- Mobile View -->
        <q-toolbar-title>
          <div class="q-pa-md q-gutter-sm text-center">
            <q-btn color="primary" text-color="white" glossy unelevated icon="home" to="/" />
            <template v-if="user" class="*q-pa-md">
              <q-btn color="primary" text-color="white" glossy unelevated icon="person" to="/profile" />
              <q-btn color="primary" text-color="white" glossy unelevated icon="people" to="/users" v-if="admins|| sellers" />
              <q-btn color="primary" text-color="white" glossy unelevated icon="assessment" to="/analytics" v-if="admins" />
            </template>
            <template v-else class="*q-pa-md">
              <q-btn color="primary" text-color="white" glossy unelevated icon="vpn_key" to="/login" />
              <q-btn color="primary" text-color="white" glossy unelevated icon="add_to_queue" to="/register" />
            </template>
            <!-- <q-btn type="a" target="_blank" glossy unelevated href="https://www.patreon.com/modemb">
                <i class="fab fa-patreon fa-2x"/>
            </q-btn> -->
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
    <!-- Footer End -->

    <q-ajax-bar size="5px"/>
  </q-layout>
</template>

<script>
import { openURL, QAjaxBar } from 'quasar'
import { mapGetters } from 'vuex'
import { url } from 'boot/axios'
import LocaleDropdown from '../components/LocaleDropdown'

export default {
  openURL,
  components: {
    QAjaxBar,
    LocaleDropdown
  },
  data () {
    return {
      desktop: this.$q.platform.is.desktop,
      authDrawer: true,
      leftDrawerOpen: false, // this.$q.platform.is.desktop,
      rightDrawer: false,
      url: url
    }
  },
  computed: {
    ...mapGetters({
      user: 'users/authGetter',
      token: 'users/tokenGetter',
      appName: 'config/appNameGetter'
    }),
    avatar () {
      if (this.user.avatar) {
        if (this.user.avatar.includes('images/profile')) return this.url + '/' + this.user.avatar
        else return this.user.avatar
      } else return this.user.new.avatar
    },
    admins () { // ================ Users Roles ============== \\
      return this.user.id === 1 || this.user.role === 'Admin'
    }, // Admins View
    sellers () {
      return this.user.role === 'Seller'
    } // Seller View
  }, // ========================== Users Role End ============ \\
  mounted () {
    if (this.user) this.authDrawer = this.user ? 0 : 1
  },
  methods: {
    async logout () {
      // Log out the user.
      this.$store.dispatch('users/logoutAction', this.user)
        .then(() => {
          this.authDrawer = true
        })
    }
  }
}
</script>

<style scoped>
</style>
