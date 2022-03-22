<template>
  <div class="q-ma-md">
    <q-dialog v-model="PopUp"><!-- Notification PopUp ===========-->
      <q-card class="my-card text-black" style='width:800px'>
        <q-card-section class="bg-primary text-white">
          <q-btn color="primary" text-color="white" class="float-right" dense round icon="close" v-close-popup/>
          <q-btn color="primary" text-color="white"
            class="float-right q-mr-xs"
            label="Mark all as read"
            dense v-show="hasUnread"
            @click.prevent="markAllRead"
          /><!-- -->
          <div class="text-h6">{{$t('notifications')}} {{ total }}</div>
        </q-card-section>
        <notification v-for="notification in notifications"
                      :key="notification.id"
                      :notification="notification"
                      @read="markAsRead(notification)"
        /><notifications-demo />
        <div v-if="hasUnread" class="text-center">
          <a href="#" @click.prevent="fetch(null)">View All</a>
        </div>
      </q-card>
    </q-dialog><!--=============== TagNotification: Notification -->

    <q-btn dense round flat icon="fas fa-bell" @click="PopUp = true" title="Notification" v-if="ipDebug">
      <q-badge color="orange" text-color="black" :label="total" floating v-if="total" /><!-- HiddenViewToImplement -->
    </q-btn>
  </div>

</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { api, SANCTUM_API } from 'boot/axios'
import Notification from './Notification'
import NotificationsDemo from './NotificationsDemo'

export default {
  components: { Notification, NotificationsDemo },
  setup () {
    const $store = useStore()

    const total = ref(0)
    const notifications = ref([])

    const auth = computed(() => $store.getters['users/authGetter'])

    onMounted(() => {
      fetch()
      if (window.Echo) listen()
    })

    /**
     * Fetch notifications.
     *
     * @param {Number} limit
     */
    function fetch (limit = 5) {
      // const url = SANCTUM_API ? 'notifications' : 'api/notifications'
      api.get('api/notifications', { params: { limit } })
        .then(({ data: { Total, Notifications } }) => {
          total.value = Total
          notifications.value = Notifications.map(({ id, data, created }) => {
            return {
              id: id,
              title: data.title,
              body: data.body,
              created: created,
              action_url: data.action_url
            }
          })
        })
    }

    /**
     * Listen for Echo push notifications.
     */
    function listen () {
      if (auth.value) window.Echo.private(`App.Models.User.${auth.value.id}`)
      // if (auth.value) window.Echo.private(`App.Models.Room.${roomId}`)
        .notification(notification => {
          total.value++
          notifications.value.unshift(notification)
        }).listen('NotificationRead', ({ notificationId }) => {
          total.value--

          const index = notifications.value.findIndex(n => n.id === notificationId)
          if (index > -1) notifications.value.splice(index, 1)
        }).listen('NotificationReadAll', () => {
          total.value = 0
          notifications.value = []
        })
    }

    return {
      total,
      PopUp: ref(false),
      notifications,
      ipDebug: computed(() => $store.getters['config/ipDebugGetter']),

      fetch,

      hasUnread () {
        return total.value > 0
      },

      /**
       * Mark the given notification as read.
       *
       * @param {Object} notification
       */
      markAsRead ({ id }) {
        const index = notifications.value.findIndex(n => n.id === id)

        if (index > -1) {
          total.value--
          notifications.value.splice(index, 1)
          const url = SANCTUM_API ? 'notifications' : 'api/notifications'
          api.patch(`${url}/${id}/read`)
        }
      },

      /**
       * Mark all notifications as read.
       */
      markAllRead () {
        total.value = 0
        notifications.value = []

        const url = SANCTUM_API ? 'notifications/mark-all-read' : 'api/notifications/mark-all-read'
        api.post(url)
      }
    }
  }
}
</script>
