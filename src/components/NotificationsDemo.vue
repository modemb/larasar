<template>
  <div class="q-pa-md">
    <q-btn color="primary"
      :disabled="loading" class="q-ma-xs"
      label="Send Notification" @click="sendNotification"
    /><!-- Send notification button -->

    <q-btn :color="isPushEnabled?'primary':'red'"
      :disabled="pushButtonDisabled||loading" class="q-ma-xs"
      @click="togglePush" :label="(isPushEnabled?'Disable':'Enable')+' Push Notifications'"
    /><!-- Enable/Disable push notifications -->
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { api, notifyAction } from 'boot/axios'

export default {
  setup () {
    const $store = useStore()
    const loading = ref(false)
    const isPushEnabled = ref(false)
    const pushButtonDisabled = ref(true)

    const vapidPublicKey = computed(() => $store.getters['config/vapidPublicKeyGetter'])

    onMounted(() => registerServiceWorker())

    function initializeServiceWorker () {
      if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
        console.log('Notifications aren\'t supported.')
        return
      }

      if (Notification.permission === 'denied') {
        console.log('The user has blocked notifications.')
        return
      }

      if (!('PushManager' in window)) {
        console.log('Push messaging isn\'t supported.')
        return
      }

      navigator.serviceWorker.ready.then(registration => {
        registration.pushManager.getSubscription().then(subscription => {
          pushButtonDisabled.value = false

          if (!subscription) return

          updateSubscription(subscription)

          isPushEnabled.value = true
        }).catch(e => notifyAction({error: 'getSubscription', e}))
      }).catch(e => notifyAction({error: 'navigator', e}))
    }

    /**
     * Subscribe for push notifications.
     */
    function subscribe () {
      navigator.serviceWorker.ready.then(registration => {
        const options = { userVisibleOnly: true }
        // const vapidPublicKey = vapidPublicKey.value

        if (vapidPublicKey.value) options.applicationServerKey =
        urlBase64ToUint8Array(vapidPublicKey.value)

        registration.pushManager.subscribe(options).then(subscription => {
          isPushEnabled.value = true
          pushButtonDisabled.value = false

          updateSubscription(subscription)
        }).catch(e => {
          if (Notification.permission === 'denied') {
            notifyAction({error: 'Permission for Notifications was denied', e})
            // console.log('Permission for Notifications was denied')
            pushButtonDisabled.value = true
          } else {
            notifyAction({error: 'Unable to subscribe to push.', e})
            // console.log('Unable to subscribe to push.', e)
            pushButtonDisabled.value = false
          }
        })
      })
    }

    /**
     * Unsubscribe from push notifications.
     */
    function   unsubscribe () {
      navigator.serviceWorker.ready.then(registration => {
        registration.pushManager.getSubscription().then(subscription => {
          if (!subscription) {
            isPushEnabled.value = false
            pushButtonDisabled.value = false
            return
          }

          subscription.unsubscribe().then(() => {
            deleteSubscription(subscription)

            isPushEnabled.value = false
            pushButtonDisabled.value = false
          }).catch(e => {
            notifyAction({error: 'Unsubscription', e})
            // console.log('Unsubscription error: ', e)
            pushButtonDisabled.value = false
          })
        }).catch(e => {
            notifyAction({error: 'Error thrown while unsubscribing', e})
          // console.log('Error thrown while unsubscribing.', e)
        })
      })
    }

    /**
     * Register the service worker.
     */
    function registerServiceWorker () {
      if (!('serviceWorker' in navigator)) {
        console.log('Service workers aren\'t supported in this browser.')
        return
      }

      navigator.serviceWorker.register('/sw.js')
        .then(() => initializeServiceWorker())
    }

    /**
     * Send a request to the server to update user's subscription.
     *
     * @param {PushSubscription} subscription
     */
    function updateSubscription (subscription) {
      const key = subscription.getKey('p256dh')
      const token = subscription.getKey('auth')
      const contentEncoding = (PushManager.supportedContentEncodings || ['aesgcm'])[0]

      const data = {
        endpoint: subscription.endpoint,
        publicKey: key ? btoa(String.fromCharCode.apply(null, new Uint8Array(key))) : null,
        authToken: token ? btoa(String.fromCharCode.apply(null, new Uint8Array(token))) : null,
        contentEncoding
      }

      loading.value = true

      api.post('api/subscriptions', data)
      // api.put('api/subscriptions', data)
        .then(() => { loading.value = false })
    }

    /**
     * Send a request to the server to delete user's subscription.
     *
     * @param {PushSubscription} subscription
     */
    function deleteSubscription (subscription) {
      loading.value = true

      api.post('api/subscriptions/delete', { endpoint: subscription.endpoint })
      // api.delete('api/subscriptions', { endpoint: subscription.endpoint })
        .then(() => { loading.value = false })
    }

    /**
     * https://github.com/Minishlink/physbook/blob/02a0d5d7ca0d5d2cc6d308a3a9b81244c63b3f14/app/Resources/public/js/app.js#L177
     *
     * @param  {String} base64String
     * @return {Uint8Array}
     */
    function urlBase64ToUint8Array (base64String) {
      const padding = '='.repeat((4 - base64String.length % 4) % 4)
      const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/')

      const rawData = window.atob(base64)
      const outputArray = new Uint8Array(rawData.length)

      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
      }

      return outputArray
    }

    return {
      loading,
      isPushEnabled,
      pushButtonDisabled,

      /**
       * Toggle push notifications subscription.
       */
      togglePush () {
        if (isPushEnabled.value) unsubscribe()
        else subscribe()
      },

      /**
       * Send a request to the server for a push notification.
       */
      sendNotification () {
        loading.value = true

        api.post('api/notifications?notify=1')
          .then(() => { loading.value = false })
          .catch(e => notifyAction({error: 'getSubscription', e}))
      }
    }
  }
}
</script>
