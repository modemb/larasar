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
    <q-drawer
      show-if-above
      v-model="rightDrawer"
      bordered
      content-class="bg-grey-2"
    >
      <q-img class="absolute-top" src="https://cdn.quasar.dev/img/material.png" style="height: 150px">
        <div class="absolute-bottom bg-transparent text-center">
          <template v-if="auth">
            <q-avatar size="70px" class="*q-mb-sm">
              <img :src="avatar">
            </q-avatar><!-- TagAvatar: UserModule -->
            <div class="text-weight-bold">
              <q-btn-dropdown
                rounded
                :label="auth.name"
                @click.prevent="authDrawer = !authDrawer"
              >
              </q-btn-dropdown>
            </div>
            <div>{{ auth.email }}</div>
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
          <q-item clickable tag="a" target="_blank" href="https://awesome.quasar.dev">
            <q-item-section avatar>
              <q-icon name="favorite" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Quasar Awesome</q-item-label>
              <q-item-label caption>Community Quasar projects</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <q-list v-else>
          <q-item clickable to='/profile'>
            <q-item-section avatar>
              <q-icon name="fas fa-user" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{$t('profile')}}</q-item-label>
              <q-item-label caption>{{authRole}}</q-item-label>
            </q-item-section>
          </q-item>
          <div v-if="role.admins || role.users"><!-- Admins and Users View ====-->
            <q-item clickable to='/users'>
              <q-item-section avatar>
                <q-icon name="fas fa-users" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{$t('users')}}</q-item-label>
                <q-item-label caption>{{authRole}}'s Users</q-item-label>
              </q-item-section>
            </q-item>
          </div><!--================================ Admins and Users View End -->
          <div v-if="role.admins || role.users || role.editors"><!-- Admins, Users and Editors View ==============-->
            <q-item clickable to='/posts'>
              <q-item-section avatar>
                <q-icon name="fas fa-list-alt" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{$t('posts')}}</q-item-label>
                <q-item-label caption>{{authRole}}'s {{$t('posts')}}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable to="/messages">
              <q-item-section avatar>
                <q-icon name="fas fa-comments" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{$t('Messages')}}</q-item-label>
                <q-item-label caption>{{authRole}}'s {{$t('Messages')}}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable to='/favorites' v-if="role.admins || role.users">
              <q-item-section avatar>
                <q-icon name="fas fa-heart" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{$t('favorites')}}</q-item-label>
                <q-item-label caption>{{authRole}}'s Posts</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable to='/library'>
              <q-item-section avatar>
                <q-icon name="fas fa-photo-video" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{$t('My Library')}}</q-item-label>
                <q-item-label caption>{{authRole}}'s {{$t('Library')}}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable to='/reports'>
              <q-item-section avatar>
                <q-icon name="fas fa-file-alt" /><!-- FixHere -->
              </q-item-section>
              <q-item-section>
                <q-item-label>{{$t('reports')}}</q-item-label>
                <q-item-label caption>{{authRole}}'s {{$t('reports')}}</q-item-label>
              </q-item-section>
            </q-item>
          </div><!--================================================ Admins, Users and Editors View End ==========-->
          <div v-if="role.admins"><!--============================== Admins View =================================-->
            <q-item clickable to='/analytics'>
              <q-item-section avatar>
                <q-icon name="fas fa-chart-bar" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{$t('analytics')}}</q-item-label>
                <q-item-label caption>{{authRole}}'s Analytics</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable to='/views'>
              <q-item-section avatar>
                <q-icon name="fas fa-eye" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{$t('views')}}</q-item-label>
                <q-item-label caption>{{authRole}}'s views</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable to="/locations">
              <q-item-section avatar>
                <q-icon name="fas fa-location-arrow" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{$t('locations')}}</q-item-label>
                <q-item-label caption>{{authRole}}'s locations</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable to='/pages'>
              <q-item-section avatar>
                <q-icon name="fas fa-pager" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{$t('pages')}}</q-item-label>
                <q-item-label caption>{{authRole}}'s pages</q-item-label>
              </q-item-section>
            </q-item>
          </div><!--================================================ Admins View End =============================-->
          <q-item clickable :to="{name: 'auth.test'}" v-if="role.admins||ipDebug">
            <q-item-section avatar>
              <q-icon name="fas fa-check" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Test</q-item-label>
              <q-item-label caption>@CheckCode</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <div v-if="auth" class="q-pa-md"><!-- Authenticated ====-->
          <q-btn icon="lock_open" :label="$t('logout')" @click.prevent="logout" />
        </div><!--=========================== Authenticated End -->
        <div v-else class="q-pa-md"><!--===== Guest ============-->
          <q-btn icon="vpn_key" :label="$t('login')" :to="{name: 'guest.login'}" />
          <q-btn icon="add_to_queue" :label="$t('register')" :to="{name: 'guest.register'}" />
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
          <q-btn type="a" target="_blank" label="Suguffiè"
            icon="fas fa-store" href="https://suguffie.com"
          ><!-- Link To Suguffiè -->
            <!-- <q-avatar>
              <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg">
            </q-avatar> -->
          </q-btn>
          <q-btn icon="fas fa-bug" :label="$t('iP Debug On')" color="red" v-if="ipDebug" />
          Quasar v{{ $q.version }}
          Laravel v{{laravel}}
          Vue v{{version}}
          Desktop View
        </q-toolbar-title>
        <q-btn glossy unelevated to="/messages">
            <i class="fas fa-comments fa-2x"/>
        </q-btn>
      </q-toolbar>
    </q-footer>
    <q-footer elevated v-else>
      <q-toolbar><!-- Mobile View -->
        <q-toolbar-title>
          <div class="*q-pa-md q-gutter-sm text-center">
            <q-btn color="primary" :text-color="path=='/'?'orange':color" glossy unelevated icon="fas fa-store" to="/" />
            <template v-if="auth" class="*q-pa-md">
              <q-btn color="primary" :text-color="path=='/users'?'orange':'white'" glossy unelevated icon="people" to="/users" />
              <q-btn color="primary" :text-color="path=='/analytics'?'orange':'white'" glossy unelevated icon="assessment" to="/analytics" v-if="role.admins" />
              <q-btn color="primary" :text-color="path=='/views'?'orange':'white'" glossy unelevated icon="fas fa-eye" to="/views" v-if="role.admins" />
              <q-btn color="primary" :text-color="path=='/locations'?'orange':'white'" glossy unelevated icon="fas fa-location-arrow" to="/locations" v-if="role.admins" />
              <q-btn color="primary" :text-color="path=='/posts'?'orange':'white'" glossy unelevated icon="fas fa-list-alt" to="/posts" v-else />
              <q-btn color="primary" :text-color="path=='/favorites'?'red':'white'" glossy unelevated icon="fas fa-heart" to='/favorites' v-if="role.users" />
            </template>
            <template v-else class="*q-pa-md">
              <q-btn color="primary" :text-color="path=='/login'?'orange':'white'" glossy unelevated icon="vpn_key" to="/login" />
              <q-btn color="primary" :text-color="path=='/register'?'orange':'white'" glossy unelevated icon="add_to_queue" to="/register" />
            </template>
            <q-btn :text-color="path=='/messages'?'orange':'white'" glossy unelevated icon="fas fa-comments fa-2x" to="/messages"/>
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
    <!-- Footer End -->

    <q-ajax-bar size="5px"/>
  </q-layout>
</template>

<script>
import { openURL, QAjaxBar, useQuasar, Cookies } from 'quasar'
import { ref, computed, watch, onMounted, version } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { url, userData, notifyAction, crudAction, api } from 'boot/axios'
import LocaleDropdown from '../components/LocaleDropdown'

/**
 * Tags: SearchModule - AdModule - IpDebugModule - TagPostLacation
 *
 * @from
 */
export default {
  openURL,
  components: {
    QAjaxBar,
    LocaleDropdown
  },
  setup () {
    const $q = useQuasar()
    const $route = useRoute()
    const $store = useStore()
    const authDrawer = ref(true)
    const category = ref(null)
    const pages = ref([])
    const region = ref(null)
    const country = ref(null)
    const city = ref(null)

    // $q.dark.set(true) // https://quasar.dev/quasar-plugins/dark#introduction

    const auth = computed(() => $store.getters['users/authGetter'])
    const roles = computed(() => $store.getters['users/rolesGetter'])
    const token = computed(() => $store.getters['users/tokenGetter'])
    const loc = computed(() => $store.getters['users/locationGetter'])
    const locale = computed(() => $store.getters['config/localeGetter'])
    const appName = computed(() => $store.getters['config/appNameGetter'])
    const ipDebug = computed(() => $store.getters['config/ipDebugGetter'])

    watch(locale, val => {
      crudAction({
        locale: val,
        url: 'api/pages/1',
        method: 'get',
        pages: 1
      }).then(getPages => {pages.value = getPages})
        .catch(e => notifyAction({error: 'localeSidePages', e}))
    }) // TagWatch: localePageModule

    watch(authDrawer, () => {
      crudAction({
        locale: locale.value,
        url: 'api/pages/1',
        method: 'get',
        pages: 1
      }).then(getPages => {pages.value = getPages})
        .catch(e => notifyAction({error: 'authDrawerPages', e}))
    }) // TagWatch: authDrawerPageModule

    watch(token, val => authDrawer.value = val ? 0 : 1) // TagWatch: AuthModule

    onMounted(() => {
      showInstallPromotion() // TagApp: AppModule
      if (token.value) authDrawer.value = false // TagWatch: AuthModule
      else crudAction({
        locale: locale.value,
        url: 'api/pages/1',
        method: 'get',
        pages: 1 // TagPage: PageModule
      }).then(getPages => {pages.value = getPages})
        .catch(e => notifyAction({error: 'mountedDrawerPages', e}))
      try {
        city.value = userData.city
        region.value = userData.region
        country.value = userData.country
      } catch (error) {}
    })

    function showInstallPromotion () {
      window.addEventListener('beforeinstallprompt', e => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault(); color.value = 'yellow'; setTimeout(() => {
          $q.notify({
            color: 'positive',
            position: 'top', // bottom - top
            message: $t('Get our free app for better experience. It wont take up space'),
            icon: 'fas fa-store',
            timeout: 0,
            actions: [
              { label: $t('Install App'), color: 'white', handler: () => installApp(e) },
              { icon: 'close', color: 'white', handler: () => { color.value = 'white' } }
            ] // <https://web.dev/customize-install> - <https://web.dev/codelab-make-installable>
          }) // https://developers.google.com/web/fundamentals/app-install-banners/native#mini-info-bar
        }, 500) // https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Add_to_home_screen
        function installApp (e) {
          e.prompt(); e.userChoice.then(choiceResult => {
            if (choiceResult.outcome === 'accepted') Cookies.set('appinstalled', userData, { expires: 365 })
            color.value = 'white'// either "accepted" or "dismissed"
          })
        }
      })
    } // TagApp: AppModule

    return {
      appName,
      ipDebug,
      version,
      auth,
      pages,
      path: computed(() => $route.path),
      laravel: computed(() => $store.getters['config/laravelGetter']),
      postPage: computed(() => $store.getters['crud/Getter']?.postPage),
      tab: ref('mails'),
      color: ref('white'),
      banner: ref(true),
      desktop: $q.platform.is.desktop,
      authDrawer,
      leftDrawerOpen: ref(false), // $q.platform.is.desktop,
      rightDrawer: ref(false),
      loader: ref(false),
      url,
      userData,
      region,
      country,
      city,
      // ====Search=== \\
      search_posts: ref(null),
      location: ref(false),
      // ============== \\
      category,
      // ================== \\
      admin: computed(() => Cookies.get('authID')),
      role: computed(() => roles.value),
      place: computed(() => loc.value),
      authRole: computed(() => {
        try {
          return auth.value.role
        } catch (e) { return false }
      }), // Auth Role
      superAdmin: computed(() => {
        try {
          return auth.value.id === 1
        } catch (e) { return false }
      }),
      avatar: computed(() => {
        if (auth.value?.avatar) {
          if (auth.value.avatar?.includes('images/profile')) return url + '/' + auth.value.avatar
          else return auth.value.avatar
        } else return auth.value?.new?.avatar
      }),

      logout () {
        $store.dispatch('users/logoutAction', auth.value)
        const authID = Cookies.get('authID')
                       Cookies.remove('authID')

        if (authID) setTimeout(() => {
            api({
              url: 'api/users',
              method: 'post',
              data: { log: true, userId: authID }
            }).then(() => {$store.dispatch('users/loginAction')})
              .catch(e => notifyAction({error: 'logAuth', e}))
        }, 500) // Log Back To Auth Account
      }//, authID
    }
  }
}
</script>

<style scoped>
/* .my-card {
  width: 100%;
  max-width: 300px;
} */
.q-btn {
    *text-transform: none;
}
.search {
    border-radius: 4px;
    background: white;
}
[v-cloak] {
  display: none !important;
}
</style>
