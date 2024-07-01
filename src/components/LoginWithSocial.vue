<template>
  <span v-for="(provider, key) in drivers" :key="key">
    <q-btn color="primary" class="q-ma-sm col-lg-3"
      v-if="!mobileApp||ipDebug"
      :icon='"fab fa-"+provider'
      :label="$t('login_with')"
      @click.prevent="login(provider)"
    /><!--  -->
  </span>
</template>

<script lang="ts">
import { computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { capacitor } from './Functions'
import { i18n, api, mobileApp, loginMutation, logoutAction } from 'boot/axios'
import { useCrudStore } from 'stores/crud'

export default {
  name: 'LoginWithSocial',
  setup () {
    const $route = useRoute()
    const store = useCrudStore()
    const { notifyAction } = store
    const $t = i18n?.global?.t

    const auth = computed(() => store.authGetter)//computed(() => $store.getters['users/authGetter'])

    onMounted (() => {

      if ($route.params.driver) // Oauth Callback
      api.get(`/api/login/${$route.params.driver}/callback`, {
          params: $route.query
        }).then(({ data }, token = data) => {

        if (!token.remember) token = {
          access_token: '$provider',
          remember: true,
          expires_in: 365
        };window.opener.postMessage({ token }, window.location.href)
        window.close() // https://laravel.com/docs/8.x/responses#other-response-types

      }).catch((e: unknown) => notifyAction({error: 'LoginWithSocial', e}))

      window.addEventListener('message', onMessage, false)
    })

    onBeforeUnmount (() => window.removeEventListener('message', onMessage))

    async function log(provider: string) {
      const newWindow = mobileApp || openWindow('', $t('login'))
      const { data: { url } } = await api.post(`/api/login/${provider}`)
        .catch(e => notifyAction({error: 'logProvider', e}))

      try { // openWindow(data.url, $t('login')) // window.location.href = url
        if (mobileApp) await capacitor().Browser.open({ url })
        else newWindow.location.href = url
      } catch (e) { notifyAction({error: 'openBrowser', e}) }
    }

    /**
     * @param {MessageEvent} e
     */
    function  onMessage (e: { data: { token: string }; origin: string }) {
      if (!e.data.token || e.origin !== window.origin) return
      loginMutation({token: e.data.token, remember: true})
      // $store.commit('users/loginMutation', e.data.token)
    }

    /**
     * @param  {Object} options
     * @return {Window}
     */
    function openWindow (url: string | URL | undefined, title: string | undefined, options = {}) {
      if (typeof url === 'object') {
        options = url
        url = ''
      }

      options = { url, title, width: 600, height: 720, ...options }

      const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screen.left
      const dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screen.top
      const width = window.innerWidth || document.documentElement.clientWidth || window.screen.width
      const height = window.innerHeight || document.documentElement.clientHeight || window.screen.height

      options.left = ((width / 2) - (options.width / 2)) + dualScreenLeft
      options.top = ((height / 2) - (options.height / 2)) + dualScreenTop

      const optionsStr = Object.keys(options).reduce((acc, key) => {
        acc.push(`${key}=${options[key]}`)
        return acc
      }, []).join(',')

      const newWindow = window.open(url, title, optionsStr)

      if ('focus' in window) newWindow?.focus()

      return newWindow
    }

    return {
      drivers: [
        'github',
        // 'facebook',
        // 'google'
      ], mobileApp,
      ipDebug: computed(() => store['configGetter']?.ipDebug),
      async login(provider: string) {
        if (auth.value) { logoutAction()
          setTimeout(() => log(provider), 1500)
        } else log(provider)
      }
    }
  }
}
</script>
