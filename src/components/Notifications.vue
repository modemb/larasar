<template>
  <q-dialog v-model="PopUp"><!-- Notification PopUp ===========-->
    <q-card class="my-card text-black" style='width:800px'>
      <q-card-section class="bg-primary text-white">
        <q-btn color="primary" text-color="white" class="float-right" dense round icon="close" v-close-popup/>
        <q-btn color="primary" text-color="white"
          class="float-right q-mr-xs"
          label="Mark all as read"
          dense v-show="hasUnread"
          @click.prevent="markAllRead"
        /><div class="text-h6">{{$t('notifications')}} {{ total }}</div>
      </q-card-section>

      <q-list bordered class="rounded-borders" style="max-width: 650px" v-for="notification in notifications" :key="notification.id">
        <!-- <q-item-label header>{{ notification.action_url }} Friends</q-item-label> @click.prevent="actionUrl(notification)"-->

        <q-item clickable v-ripple type="a" :to="notification.action_url" >
          <q-item-section avatar>
            <q-avatar>
              <img :src="notification.avatar">
              <!-- <img src="https://cdn.quasar.dev/img/avatar1.jpg"> -->
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label lines="1">{{ notification.title }}</q-item-label>
            <q-item-label caption lines="2">
              <span class="text-weight-bold">{{ notification.body }}</span>>
            </q-item-label>
            <small class="timestamp">
              <!-- <timeago :datetime="notification.created" :auto-update="60"/> -->
              {{timeago(notification.created)}}
            </small><!-- https://timeago.org -->
          </q-item-section><!-- 1 min ago -->

          <q-item-section side>
            <q-btn  dense round icon="close" @click.prevent="markAsRead(notification)" />
          </q-item-section>
        </q-item>
      </q-list><notifications-demo v-if="ipDebug" /><!-- https://quasar.dev/vue-components/list-and-list-items#example--emails -->

      <div v-if="hasUnread" class="text-center q-ma-xs">
        <q-btn icon="fas fa-eye" :label="$t('View All')" @click.prevent="fetch(null)" />
      </div>
      <div v-else class="text-center">
        {{$t("You don't have any unread notifications.")}}
      </div>
    </q-card>
  </q-dialog><!-- TagNotification: NotificationModule -->
  <div class="q-ma-md">
    <q-btn dense round flat icon="fas fa-bell" @click="PopUp = true" title="Notification">
      <q-badge color="orange" text-color="black" :label="total" floating v-if="total" />
    </q-btn>
  </div>

</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { api, timeago, url } from 'boot/axios'
import NotificationsDemo from './NotificationsDemo'
// import Notification from './Notification'

export default {
  components: {  NotificationsDemo },
  setup () {
    const $store = useStore()
    const $router = useRouter()
    const total = ref(0)
    const notifications = ref([])

    const auth = computed(() => $store.getters['users/authGetter'])
    const notify = computed(() => $store.getters['crud/Getter']?.notify)

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
      api.get('api/notifications', { params: { limit } })
        .then(({ data: { Total, Notifications } }) => {
          total.value = Total
          notifications.value = Notifications.map(({ id, data, created }) => {
            return {
              id: id,
              avatar: data.avatar,
              title: data.title,
              body: data.body,
              created: created,
              action_url: data.action_url
            }
          })
        })
    } // TagNotifications: fetchNotificationsModule

    function listen () {
      if (auth.value) window.Echo.private(`App.Models.User.${auth.value.id}`)
      // if (auth.value) window.Echo.channel(`App.Models.Room.${roomId}`)
        .notification(notification => {
          total.value++
          notifications.value.unshift(notification)
          if (notify.value) markAsRead(notification)
        }).listen('NotificationRead', ({ notificationId }) => {
          total.value--

          const index = notifications.value.findIndex(n => n.id === notificationId)
          if (index > -1) notifications.value.splice(index, 1)
        }).listen('NotificationReadAll', () => {
          total.value = 0
          notifications.value = []
        })
    } // Listen for Echo push notifications.

    /**
     * Mark the given notification as read.
     *
     * @param {Object} notification
     */
    function markAsRead ({ id }) {
      const index = notifications.value.findIndex(n => n.id === id)
          console.log('notify', notify.value, id)

      if (index > -1) {
        total.value--
        notifications.value.splice(index, 1)
        api.patch(`api/notifications/${id}?read=1`)
      }
    }

    return {
      url,
      total,
      timeago,
      PopUp: ref(false),
      notifications,

      notify,

      fetch,

      ipDebug: computed(() => $store.getters['config/ipDebugGetter']),
      hasUnread: computed(() => total.value > 0),

      markAsRead,

      markAllRead () {
        total.value = 0
        notifications.value = []

        api.post('api/notifications?mark_all_read=1')
      }, // Mark all notifications as read.

      actionUrl (notification) {
        // :to="notification.action_url"
        $router.push({ path: notification.action_url })
        markAsRead(notification)
      } // Route To The Chat Room - NotInUse
    }
  }
}
</script>
