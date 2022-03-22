<template>
  <div class="q-pa-md q-gutter-md">
    <q-list bordered class="rounded-borders" style="max-width: 650px">
      <!-- <q-item-label header>{{ notification.action_url }} Friends</q-item-label> -->

      <q-item clickable v-ripple type="a" :to="notification.action_url">
        <q-item-section avatar>
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/avatar1.jpg">
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label lines="1">{{ notification.title }}</q-item-label>
          <q-item-label caption lines="2">
            <span class="text-weight-bold">{{ notification.body }}</span>
            <!-- -- I'll be in your neighborhood doing errands this
            weekend. Do you want to grab brunch? -->
          </q-item-label>
          <small class="timestamp">
            <!-- <timeago :datetime="notification.created" :auto-update="60"/> -->
            <!-- <div class="timeago" datetime="2016-06-30 09:20:00"></div> -->
            {{timeago(notification.created)}}
          </small><!-- https://timeago.org -->
        </q-item-section><!-- 1 min ago -->

        <q-item-section side>
          <q-btn  dense round icon="close" @click.prevent="markAsRead" />
        </q-item-section>
      </q-item>
    </q-list><!-- https://quasar.dev/vue-components/list-and-list-items#example--emails -->
  </div>
</template>

<script>
import { timeago } from 'boot/axios'


/**
 * Tags: TagMessage
 *
 * @from
 */
export default {
  name: 'Notification',
  props: {
    notification: {
      type: Object,
      required: true
    }
  }, //vendor\laravel-notification-channels\webpush\README.md
  setup (props, {emit}) {

    return {
      timeago,
      markAsRead () {
        emit('read')
      }
    }
  }
}
</script>
