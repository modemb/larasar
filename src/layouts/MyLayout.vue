<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
        ><q-icon name="menu" />
        </q-btn>

        <q-btn to="/" >
          <q-toolbar-title>
            <q-icon name="home" />
            Larasar
          </q-toolbar-title>
        </q-btn>
        <!-- Authenticated -->
        <div v-if="user" class="text-right">
          <q-btn label="Logout" @click.prevent="logout" />
          <q-avatar>
            <img :src="user.new.avatar">
          </q-avatar>
          {{ user.name }}
        </div>
        <!-- Guest -->
        <div v-else class="text-right">
          <q-btn label="Login" :to="{name: 'public.login'}" class="nav-link active" />
          <q-btn label="Register" :to="{name: 'public.register'}" class="nav-link" />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      content-class="bg-grey-2"
      >
      <q-list>
        <q-item-label header><div>Quasar v{{ $q.version }}</div>Essential Links</q-item-label>
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
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'
import { mapGetters } from 'vuex'
// import LocaleDropdown from '/../components/LocaleDropdown'

export default {
  openURL,
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop
    }
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
