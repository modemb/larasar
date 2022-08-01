<template>
  <q-layout view="lHh lpr lFf" container :style="`height:${height/1.35}px`" class="shadow-2 rounded-borders">
    <q-header elevated>
      <q-bar>
        <!-- <q-icon name="fas fa-comments" />
        <div>{{roomName}}</div> -->

        <q-btn :label="mobile||roomName" icon="fas fa-undo" :to="link" />

        <q-space />

        <!-- <q-btn dense flat icon="minimize" />
        <q-btn dense flat icon="crop_square" /> -->
        <q-btn dense flat icon="close" v-close-popup v-if="roomId" />
      </q-bar>
    </q-header>

    <div class="flex flex-center q-ma-sm row">
      <q-scroll-area ref="scrollAreaRef" :class="col+' q-mt-lg'"
          :style="`height:${height/1.6}px`"
          :thumb-style="thumbStyle"
          :bar-style="barStyle"
        ><div v-for="(chat, i) in messages" :key="i" :ref="el => { if (el) position[i] = el }">
        <!-- <div v-for="(chat, key) in messages" :key="key" ref="position"> -->
          <q-chat-message :avatar="avatar(chat.user)"
            :sent="authCheck(chat.user)" :text="[chat.message]"
            :name="authCheck(chat.user)?'me':chat.user.first_name"
            :stamp="timeago(chat.updated_at)" v-if="chat.message"
          /><q-spinner-dots size="2rem" v-if="(messages.length-1===i)&&listening" />
        </div><!-- https://quasar.dev/vue-components/scroll-area#scroll-position -->
      </q-scroll-area><!-- =================Message=========================== -->
      <q-separator /><q-btn flat :label="height" v-if="ipDebug" />
      <q-footer :class="darkMode" elevated>
        <q-input outlined v-model="newMessage" @keydown="_typing" :class="col" @keyup.enter="sendMessage" :label="$t('Post Message')">
          <template v-slot:append>
            <q-btn flat icon="fas fa-paper-plane" @click.prevent="sendMessage" />
          </template><!-- TagMessage: sendMessageModule -->
        </q-input>
      </q-footer>
    </div>
  </q-layout>
</template>

<script>
import { useQuasar } from 'quasar'
import { ref, computed, watch, onMounted, onBeforeUpdate } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { api, timeago, notifyAction, crudAction, url, SANCTUM_API } from 'boot/axios'

/**
 * Tags: TagMessage
 *
 * @from
 */
export default {
  name: 'App',
  props: ['roomId'],
  setup (props) {
    const $q = useQuasar()
    const $store = useStore()
    const $route = useRoute()
    const messages = ref([]) // Chat
    const newMessage = ref('') // =============Form==================
    const position = ref([])
    const scrollAreaRef = ref(null)
    const roomName = ref(null)
    const listening = ref(false)
    const link = ref(null)
    const height = ref(null)
    const mobile = ref($q.platform.is.mobile)

    const auth = computed(() => $store.getters['users/authGetter'])
    const roomId = computed(() => $route.params.id||props.roomId)

    const URL = SANCTUM_API?'/messages':'api/messages'

    const WindowHeight = () => height.value = screen.height
    const messaging = bool => listening.value = bool
    const throttle = 5000

    onBeforeUpdate(() => {
      position.value = [] // make sure to reset the refs before each update
    })// https://v3.vuejs.org/guide/composition-api-template-refs.html#usage-inside-v-for

    onMounted(() => onload())

    function onload () {
      fetchMessages(); WindowHeight(); window.onresize = WindowHeight
      // const channel = window.Echo.private(`App.Models.Room.${roomId}`)
      const channel =  window.Echo.channel(`App.Models.Room.${roomId.value}`)
      // channel.listenToAll((e, data) => {
      channel.listen('MessageSent', async (e) => {
        // console.log('typing', e.typing, 'listening', $route?.path.includes(`/chat/${roomId.value}`)) // true

        crudAction({notify: $route.path?.includes(`/chat/${roomId.value}`)||'e.typing ToFixNoNotificationInChat'}) // true
        .catch(e => notifyAction({error: 'notifyAction', e}))

        if (auth.value?.id !== e?.userId) {
          messaging(!e.message)
          messages.value.push({
            typing: e.typing,
            message: e.message,
            roomId: e.roomId,
            user: await crudAction({
              url: `api/users/${e.userId}`,
              method: 'get', getUser: true // TODO Fix https://pusher.com/tutorials/chat-laravel/#setting-up-pusher
            }).catch(e => notifyAction({error: 'userListening', e}))
          }); setTimeout(() => messaging(false), throttle) // auth.value?.id === e?.userId||
        } // dontBroadcastToCurrentUser


      }) // TagMessage: listenMessageModule
    } watch(roomId, () => onload())

    function fetchMessages () {
      api.get(`${URL}/${roomId.value}?messages=1`).then(res => {
        messages.value = res.data.messages
        roomName.value = res.data.name
        link.value = res.data.link
      }).catch(e => notifyAction({error: 'fetchMessages', e}))
    } // TagMessage: fetchMessageModule

    function addMessage (message) {
      console.log('newMessage', message, 'messages', messages.value)
      try { messages.value.push(message)
      } catch (e) { notifyAction({error: 'messages', e}) }

      return api.post(URL, message).then(() => {
        // console.log('addMessage', res.data)
      })//.catch(e => notifyAction({error: 'addMessage', e}))
    } // TagMessage: addMessageModule - sendMessageModule

    function scroll (i) {
      const duration = 0
      const target = 'vertical'
      const offset = position.value?.[i-1]?.offsetTop // number
      scrollAreaRef.value.setScrollPosition(target, offset, duration)
    } watch(() => position.value.length, i => scroll(i))

    return {
      position,
      timeago,
      scrollAreaRef,
      newMessage,
      messages,
      roomName,
      mobile,
      link,
      scroll,
      onload,

      col: (mobile.value||props.roomId)?'col-12':'col-8',

      height, //: computed(() => screen.height), //: computed(() => height.value),
      listening, //: computed(() => listening.value),
      darkMode: computed(() => $q.localStorage.getItem('darkMode')?'q-dark':'bg-white'),
      ipDebug: computed(() => $store.getters['config/ipDebugGetter']),

      authCheck(user) {return auth.value?.id === user?.id},

      typing(e) {
        console.log('key', e.key)
        if (e.key !== 'Enter') setTimeout(() =>
          !e.key||addMessage({
            user: auth.value,
            typing: e.key,
            room_id: roomId.value
          }).catch(e => notifyAction({error: 'typing', e})),
        throttle)
      },

      sendMessage () {
        if (newMessage.value) addMessage({
          user: auth.value,
          message: newMessage.value,
          room_id: roomId.value
        }).catch(e => notifyAction({error: 'sendMessage', e})); newMessage.value = ''
      }, // TagMessage: sendMessageModule - addMessageModule

      avatar(user) {
        if (user.avatar) {
          if (user.avatar.includes('images/profile')) return url + '/' + user.avatar
          else return user.avatar
        } else return user?.new?.avatar
      }, // ================Message End=============================

      thumbStyle: {
        right: '4px',
        borderRadius: '5px',
        backgroundColor: '#027be3',
        width: '5px',
        opacity: 0.25//0.75
      },

      barStyle: {
        right: '2px',
        borderRadius: '9px',
        // backgroundColor: '#027be3',
        width: '9px',
        opacity: 0.2
      }
    }
  }
}
</script>

<style>
/* .q-input {
  background: var(--q-dark);
} */
</style>
