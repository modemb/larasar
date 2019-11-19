<template>
  <q-btn icon="fab fa-github" :label="$t('login_with')" color="primary" class="q-ml-sm" @click.prevent="login" />
</template>

<script>
// import { mapGetters } from 'vuex'

export default {
  name: 'LoginWithGithub',

  // computed: {
  //   ...mapGetters({
  //     githubAuth: 'config/githubAuthGetter'
  //   })
  //   // url: () => `/api/login/github`
  //   // url: () => `/api/oauth/github`
  // },

  mounted () {
    window.addEventListener('message', this.onMessage, false)
  },

  beforeDestroy () {
    window.removeEventListener('message', this.onMessage)
  },

  methods: {
    async login () {
      const newWindow = openWindow('', this.$t('login'))

      const url = await this.$store.dispatch('users/githubAuthAction', {
        provider: 'github'
      })
      // let test = await this.$axios.get(url)
      newWindow.location.href = url
      console.log(newWindow.location.href)
      // window.opener.postMessage({ token: url })
    },

    /**
     * @param {MessageEvent} e
     */
    onMessage (e) {
      if (e.origin !== window.origin || !e.data.token) {
        return
      }

      this.$store.dispatch('users/authAction', {
        token: e.data.token
      })

      // this.$router.push({ name: 'public.index' })
      this.$router.push({ path: '/' })
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
