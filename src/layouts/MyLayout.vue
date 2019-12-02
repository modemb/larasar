<template>
  <q-layout view="lHr lpR lFr">
<<<<<<< HEAD
=======
    <!-- Header -->
>>>>>>> modemb/dev
    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-btn dense round icon="menu" behavior="mobile" @click="rightDrawer = !rightDrawer" />

        <q-btn to="/"  class="q-ma-md">
          <q-toolbar-title>
            <q-icon name="home" />
            Larasar
          </q-toolbar-title>
        </q-btn>

        <locale-dropdown />
        <q-btn dense round icon="menu" @click="leftDrawerOpen = !leftDrawerOpen" />
      </q-toolbar>
    </q-header>
    <!-- Header End -->

    <!-- Drawer -->
    <q-drawer
      v-model="leftDrawerOpen"
      side="right"
      behavior="mobile"
      bordered
      content-class="bg-grey-2"
    >
    </q-drawer>

    <q-drawer
      show-if-above
      v-model="rightDrawer"
      bordered
      content-class="bg-grey-2"
    >
      <q-img class="absolute-top" src="https://cdn.quasar.dev/img/material.png" style="height: 150px">
        <div class="absolute-bottom bg-transparent text-center">
          <template v-if="user">
            <q-avatar size="70px" class="q-mb-sm">
              <img :src="user.new.avatar">
            </q-avatar>
            <div class="text-weight-bold">{{ user.name }}</div>
            <div>{{ user.email }}</div>
          </template>
        </div>
      </q-img>
      <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">
        <q-list>
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
        <!-- Authenticated -->
        <div v-if="user" class="q-pa-md">
          <q-btn icon="lock_open" :label="$t('logout')" @click.prevent="logout" />
        </div>
        <!-- Guest -->
        <div v-else class="q-pa-md">
          <q-btn icon="vpn_key" :label="$t('login')" :to="{name: 'public.login'}" />
          <q-btn icon="add_to_queue" :label="$t('register')" :to="{name: 'public.register'}" />
        </div>
      </q-scroll-area>
    </q-drawer>
    <!-- Drawer End -->

    <q-page-container>
      <router-view />
    </q-page-container>

<<<<<<< HEAD
=======
    <!-- Footer -->
>>>>>>> modemb/dev
    <q-footer elevated>
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg">
          </q-avatar>
          MoDemb.com Quasar v{{ $q.version }}
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
<<<<<<< HEAD
=======
    <!-- Footer End -->
>>>>>>> modemb/dev

    <q-ajax-bar />
  </q-layout>
</template>

<script>
import { openURL, QAjaxBar } from 'quasar'
import { mapGetters } from 'vuex'
import LocaleDropdown from '../components/LocaleDropdown'

export default {
  openURL,
  data () {
    return {
      leftDrawerOpen: false, // this.$q.platform.is.desktop,
      rightDrawer: false
    }
  },
  components: {
    QAjaxBar,
    LocaleDropdown
  },
  computed: mapGetters({
    user: 'users/authGetter'
  }),
  methods: {
    async logout () {
      // Log out the user.
      this.$store.dispatch('users/logoutAction', this.user)
        .then(() => {
          // Redirect to login.
          this.$router.push({ name: 'public.login' })
        })
    }
  }
}
</script>

<style scoped>
</style>
