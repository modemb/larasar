<template>
  <span>
    <span v-for="(provider, key) in drivers" :key="key">
      <q-btn
        :icon='"fab fa-"+provider'
        v-if="socialAuth[provider].client_id"
        :label="$t('login_with')"
        color="primary"
        class="q-ma-sm"
        @click.prevent="login(provider)"
      />
    </span>
  </span>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'LoginWithsocial',
  data () {
    return {
      drivers: [
        'github',
        'facebook',
        'google'
      ]
    }
  },
  computed: mapGetters({
    socialAuth: 'config/servicesGetter'
  }),
  mounted () {
    window.addEventListener('message', this.onMessage, false)
  },
  beforeDestroy () {
    window.removeEventListener('message', this.onMessage)
  },
  methods: {
    async login (driver) {
      const newWindow = openWindow('', this.$t('login'))
      console.log(driver)
      const url = await this.$store.dispatch('users/socialAuthAction', {
        provider: driver
      })
      newWindow.location.href = url
    },

    /**
     * @param {MessageEvent} e
     */
    onMessage (e) {
      console.log(e.origin, window.origin)
      if (/* e.origin !== window.origin || */ !e.data.token) {
        return
      }
      // console.log(e.data.token, 'hi')
      try {
        this.$store.commit('users/loginMutation', e.data.token)
      } catch (e) { alert(e) }
      this.$store.dispatch('users/authAction')
        .then(() => {
          this.$router.push({ path: '/' })
        })
    }
  }
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

  if (window.focus) {
    newWindow.focus()
  }

  return newWindow
}
</script>
