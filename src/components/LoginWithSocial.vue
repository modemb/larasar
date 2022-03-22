<template>
  <span v-for="(provider, key) in drivers" :key="key">
    <q-btn :icon='"fab fa-"+provider'
      :label="$t('login_with')"
      color="primary"
      class="q-ma-sm col-lg-3"
      @click.prevent="login(provider)"
    />
  </span>
</template>

<script>
import { i18n, api, crudAction, notifyAction } from 'boot/axios'
import { computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import {  useStore } from 'vuex'

export default {
  name: 'LoginWithsocial',
  setup () {
    const $route = useRoute()
    const $store = useStore()
    const $t = i18n?.global?.t

    const auth = computed(() => $store.getters['users/authGetter'])

    onMounted (() => {
      !$route.params.driver||crudAction({...$route.query, ...{
        url: `/api/login/${$route.params.driver}/callback`, // Oauth Callback
        method: 'get'
      }}).then(token => {

        if (!token.remember) token = {
          access_token: '$provider',
          remember: true,
          expires_in: 365
        };window.opener.postMessage({token: token}, window.location.href)
        window.close() // https://laravel.com/docs/8.x/responses#other-response-types

      }).catch(e => notifyAction({error: 'LoginWithsocial', e}))

      window.addEventListener('message', onMessage, false)
    })

    onBeforeUnmount (() => window.removeEventListener('message', onMessage))

    async function log (provider) {
      // openWindow(`/api/login/${provider}`, $t('login'))
      const newWindow = openWindow('', $t('login'))
      const { data } = await api.post(`/api/login/${provider}`)
        .catch(e => notifyAction({error: 'logProvider', e}))
      newWindow.location.href = data.url
      // window.location.href = data.url
    }

    /**
     * @param {MessageEvent} e
     */
    function  onMessage (e) {
      if (!e.data.token || e.origin !== window.origin) return
      $store.commit('users/loginMutation', e.data.token)
    }

    /**
     * @param  {Object} options
     * @return {Window}
     */
    function openWindow (url, title, options = {}) {
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

      if (window.focus) newWindow.focus()

      return newWindow
    }

    return {
      drivers: [
        'github',
        // 'facebook',
        // 'google'
      ],
      async login (provider) {
        if (auth.value) {
          $store.dispatch('users/logoutAction', auth.value)
          setTimeout(() => {
            log(provider)
          }, 500)
        } else log(provider)
      }
    }
  }
}
</script>
