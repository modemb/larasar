<template>
  <q-layout view="lHh lpr lFf" container :style="`height:${height/1.35}px`" class="shadow-2 rounded-borders">
    <q-header elevated>
      <q-bar>
        <!-- <q-icon name="fas fa-comments" />
        <div>{{roomName}}</div> -->

        <q-btn :label="mobile?'':roomName" icon="fas fa-undo" :to="link" />

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
        <!-- <div v-for="(chat, key) in messages" :key="key" ref="position"> <i class="fa-solid fa-check-double"></i>-->
          <q-chat-message :avatar="avatar(chat.user)"
            :sent="authCheck(chat.user)" :text="[chat.message]"
            :name="authCheck(chat.user)?'me':chat.user?.first_name"
            :stamp="timeago(chat.updated_at)" v-if="chat.message"
          /><i class="text-green fa-solid fa-check-double float-right" v-if="ipDebug&&authCheck(chat.user)" />
          <q-spinner-dots size="2rem" v-if="(messages.length-1===i)&&listening" />
        </div><!-- https://quasar.dev/vue-components/scroll-area#scroll-position -->
      </q-scroll-area><!-- =================Message=========================== -->
      <q-separator dark /><q-btn flat :label="height" v-if="ipDebug" />
      <q-footer :class="darkMode" elevated>
        <q-input clearable outlined v-model="newMessage" @keydown="chatting" :class="col" @keyup.enter="sendMessage" :label="$t('Send Message')">
          <template v-slot:append>
            <q-btn flat icon="fas fa-paper-plane" @click.prevent="sendMessage" />
          </template><!-- TagMessage: sendMessageModule -->
        </q-input>
      </q-footer>
    </div>
  </q-layout>
</template>

<script lang="ts">
import { useQuasar } from 'quasar'
import { ref, computed, watch, onMounted, onBeforeUpdate } from 'vue'
import { useRoute } from 'vue-router'
import { useCrudStore } from 'stores/crud'
import { api, timeago, SANCTUM_API, baseURL } from 'boot/axios'

/**
 * Tags: TagMessage
 *
 * @to
 */
export default {
  name: 'App',
  props: ['roomId'],
  setup (props) {
    const $q = useQuasar()
    const store = useCrudStore()
    const { crudAction, notifyAction } = store
    const $route = useRoute()
    const messages = ref<any[]>([]) // Chat
    const newMessage = ref('') // =============Form==================
    const notReceived = ref(false)
    const listening = ref(false)
    const typing = ref(false)
    const position = ref<any>([])
    const scrollAreaRef = ref<any>(null)
    const roomName = ref('')
    const link = ref(null)
    const height = ref<number>(0)
    const mobile = ref($q.platform.is.mobile)

    const auth = computed(() => store.authGetter)
    const chatUser = computed(() => store['chatUserGetter'])
    const roomId = computed(() => $route.params.id||props.roomId)
    const ipDebug = computed(() => store['configGetter']?.ipDebug)

    // const url = SANCTUM_API?'/messages':'api/messages'
    const url = 'api/messages'
    const timeout = 5000
    const ios = navigator.userAgent.match(/(modembIos)/)

    // const authCheck = (user: { id: number }) => auth.value?.id === user?.id
    const WindowHeight = () => height.value = screen.height/(ipDebug.value?1:ios?1.23:1)
    const messaging = (bool: boolean) => listening.value = bool

    // https://v3.vuejs.org/guide/composition-api-template-refs.html#usage-inside-v-for
    onBeforeUpdate(() => position.value = []) // make sure to reset the refs before each update
    onMounted(() => onload())

    function onload() {

      fetchMessages(); WindowHeight(); window.onresize = WindowHeight

      // const channel = window.Echo.private(`App.Models.Room.${roomId}`)
      const channel =  window.Echo.channel(`App.Models.Room.${roomId.value}`)

      // channel.listenToAll((e, data) => {
      channel.listen('MessageSent', async (e: { roomId: number; userId: number; message: string; received: boolean; typing: string }) => {

        crudAction({
          notify: $route.path?.includes(`/chat/${e.roomId}`),//||'e.typing ToFixNoNotificationInChat',
          mutate: 'notifyGetter', refresh: ['notifyGetter']
        }).then(e => {
          // console.log('notifyAction', e)
        }) // true

        const bool = chatUser.value?.id === e?.userId

        if (auth.value?.id !== e?.userId) {
          messaging(!e.message)

          // Check If Message is Received
          if (e?.received) notReceived.value = !messaging(false)
          else addMessage({ received: true, room_id: e.roomId })

          setTimeout(() => messaging(false), timeout)

          messages.value?.push({
            typing: e.typing,
            message: e.message,
            room_id: e.roomId,
            // roomId: e.roomId, // await api.get(`api/users/${e.userId}`, { params: { getUser: true } })
            user: bool ? chatUser.value : await crudAction({
              url: `api/users/${e.userId}`,
              method: 'get', getUser: true,
              mutate: 'chatUserGetter', refresh: ['chatUserGetter']
            }).catch(e => notifyAction({error: 'userListening', e}))
          }) // ^^^ https://pusher.com/tutorials/chat-laravel/#setting-up-pusher

        } // dontBroadcastToCurrentUser

        if ($q.cookies.get('notReceived') !== 'notReceived')
        setTimeout(() => !e.message||notReceived.value||addMessage({
          notReceived: true,
          emailMessage: e.message,
          emailRoomId: e.roomId
        }), timeout) // Send Message To Email When Not Received

      }) // TagMessage: listenMessageModule

    } watch(roomId, () => onload())

    function fetchMessages () {
      api.get(`${url}/${roomId.value}?messages=1`).then(({ data }) => {
        messages.value = data.messages
        roomName.value = data.name
        link.value = data.link
      }).catch(e => notifyAction({error: 'fetchMessages', e}))
    } // TagMessage: fetchMessageModule

    function addMessage(params: { received?: boolean; room_id?: number; emailMessage?: string; notReceived?: boolean; emailRoomId?: number; typing?: string; message?: string; user?: object }) {

      if (params.notReceived) $q.cookies.set('notReceived', 'notReceived', {expires: '1h'})

      messages.value?.push(params)
      return api.post(url, params)

    } // TagMessage: addMessageModule - sendMessageModule

    function scroll(i: number) {
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
      // darkMode: computed(() => $q.localStorage.getItem('darkMode')?'q-dark':'bg-white'),
      darkMode: computed(() => store.darkModeGetter?.darkMode?'q-dark':'bg-white'),
      ipDebug,//: computed(() => store['configGetter']?.ipDebug),

      authCheck: (user: { id: number }) => auth.value?.id === user?.id,

      chatting(e: { key: string }) {

        console.log('key', e.key)

        if ((!e.key||(e.key !== 'Enter'))&&!typing.value)
          addMessage({ typing: e.key, room_id: roomId.value })
            .then(() => typing.value = true)
            .catch(e => notifyAction({error: 'typing', e}))

        setTimeout(() => typing.value = messaging(false), timeout)

      },

      sendMessage () {
        if (newMessage.value) addMessage({
          message: newMessage.value,
          user: auth.value,
          room_id: roomId.value
        }).catch(e => notifyAction({error: 'sendMessage', e})); newMessage.value = ''
      }, // TagMessage: sendMessageModule - addMessageModule

      avatar(user: { avatar: string; new: { avatar: string } }) {
        if (user?.avatar) {
          if (user?.avatar.includes('files/')) return baseURL + '/' + user.avatar
          else return user?.avatar
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
        backgroundColor: '#027be3',
        width: '9px',
        opacity: 0.2
      }
    }
  }
}
</script>

<style scoped>
/* .q-input {
  background: var(--q-dark);
} */
.message-list {
  border: 1px solid #ccc;
  padding: 10px;
  max-width: 400px;
  overflow-y: auto;
  margin-bottom: 10px;
}
.message {
  margin-bottom: 5px;
}
.input-box {
  display: flex;
  align-items: center;
}

q-input {
  flex: 1;
  margin-right: 5px;
}
</style>
