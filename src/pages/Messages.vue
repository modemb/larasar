<template>
  <div class="*q-pa-md">

    <q-dialog v-model="viewChat"><!--=========== Edit Chat PopUp ===========-->
        <q-card class="my-card" style="width: 100%; max-width: 1000px">
          <chat :roomId="roomId" /><!-- TagViewChat: chatModule -->
        </q-card>
    </q-dialog><!--============================= Edit Chat PopUp End =======-->

    <!--============ Data Table ========================-->
    <q-table
      hide-header
      :style="'height:' + height + 'px'"
      ref="table"
      :title="$t('Chats List')"
      :rows="rows"
      :columns="columns"
      row-key="id"
      virtual-scroll
      :virtual-scroll-item-size="48"
      :rows-per-page-options="[0]"

      :filter="filter"
      binary-state-sort
    >
    <!--
      :pagination="pagination"
      :loading="loading" ToFix keep rolling
      @request="onRequest"
     -->

      <template v-slot:body="props">
        <div class="q-pa-md q-gutter-md" v-if="messageExist(props.row)">
          <q-list bordered class="rounded-borders ellipsis" style="max-width: 1600px">
            <q-item>
              <q-item-section style="max-width: 150px; max-height: 150px;">
                <q-img :src="url+'/'+props.row.post.pics[0].pic" v-if="props.row.post.pics[0]"/>
                <q-icon name="fas fa-plus-circle" color="black" size="150px" v-else/>
              </q-item-section>

              <!-- <q-item-section top class="col-2 gt-sm">
                <q-item-label class="q-mt-sm">GitHub</q-item-label>
              </q-item-section> -->

              <q-item-section>
                <q-item-label lines="1" class="q-mt-xs text-body2 text-weight-bold text-primary text-uppercase">
                  <!-- <span class="cursor-pointer">Open in GitHub</span> -->
                  <q-btn flat dense :label="props.row.post.post_title" :to="'/chat/' + props.row.room_id" />
                </q-item-label>
                <q-item-label lines="1">
                  <span class="text-weight-medium">{{getUser(props.row.room.messages).name}}</span>
                  <!-- <span class="text-weight-medium">{{props.row.room.messages[0].user.first_name}}</span> -->
                </q-item-label><!-- getUser -->

                <q-item-label lines="1">
                  <span class="text-grey-8"> {{props.row.room.messages.at(-1).message}}</span>
                </q-item-label>

                <div class="text-grey-8 q-gutter-xs">
                  <!-- <q-btn class="*gt-xs" size="12px" flat dense :label="$t('receipt')" icon="fas fa-receipt" @click="receipt(props.row)" /> -->
                  <!-- <q-btn class="*gt-xs" size="12px" flat dense :label="$t('edit')" icon="edit" @click="edit(props.row)" /> -->

                  <template v-if="myChats=='trashed'">
                  <q-btn class="*gt-xs" size="12px" flat dense :label="$t('restore')" icon="restore" @click="restore(props.row)" />
                  <q-btn class="*gt-xs" size="12px" flat dense :label="$t('delete_forever')" icon="delete_forever" @click.prevent="delete_forever(props.row)" />
                  </template><q-btn class="*gt-xs" size="12px" flat dense :label="$t('delete')" icon="delete" v-else @click="Delete(props.row)" />

                  <q-btn dense flat icon="fas fa-comments"
                    title="Views" @click="edit(props.row)"
                    >
                    <!-- <q-badge color="orange" text-color="black" :label="props.row.room.messages.at(-1).message"  lines="1" /> -->
                  </q-btn><!-- TagView: ViewModule v-if="count" -->

                </div><!-- TagDeleteChat: ChatModule -->
                <small class="timestamp">
                  <!-- <timeago :datetime="props.row.updated_at" :auto-update="60" /> -->
                  {{timeago(props.row.updated_at)}}
                </small>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </template>
      <template v-slot:top-right>
        <!-- <div> -->
          <q-btn-toggle
            v-model="myChats"
            class="my-custom-toggle q-ma-md"
            no-caps push
            rounded glossy
            unelevated v-if="ipDebug"
            toggle-color="primary"
            color="white"
            text-color="primary"
            :options="[
              {label: $t('my_chats'), value: 'my_chats'},
              {label: $t('Gallery'), value: 'gallery'},
              {label: $t('Expired chats'), value: 'expired_chats'},
              {icon: 'restore', value: 'trashed'}
            ].concat(role.admins?[{label: $t('all'), value: 'all_chats'}]:[])"
          />
        <!-- </div>TagMyChat: chatModule -->
        <q-input borderless dense debounce="300" v-model="filter" :placeholder="$t('search')">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

    </q-table>
    <!--============ Data Table End ====================-->

  </div>
</template>

<script>
import { ref, watch, computed } from 'vue'
import { useStore } from 'vuex'
import { i18n, url, api, timeago, crudAction, notifyAction, ipDebug } from 'boot/axios'
// import { i18n } from 'boot/i18n'
import Chat from '../components/Chat'

/**
 * Tags: TagDeleteChat
 *
 * @from CategoryController
 */
export default {
  components: {
    Chat // TagViewChat: ChatModule
  },
  setup () {
    const $t = i18n?.global?.t
    const $store = useStore()
    // const $q = useQuasar()
    const viewChat = ref(false)
    const chatData = ref({})
    const chats = ref([])
    const roomId = ref(null)
    const myChats = ref('my_chats')

    const auth = computed(() => $store.getters['users/authGetter'])

    chatsAction({ user_chats: 'my_chats', user_id: auth.value.id })

    watch(myChats, val => {
      chatsAction({ user_chats: val, user_id: auth.value.id })
    })

    function chatsAction (payload) {
      crudAction({...payload, ...{
        url: 'api/messages/1',
        method: 'get',
        rooms: true
      }}).then(crud => chats.value = crud)
      .catch(e => notifyAction({error: 'chatsAction', e}))
    }

    function updateChatAction (payload) {
      return $store.dispatch('categories/updateChatAction', payload)
    }

    function Delete (chat) {
      if (confirm('Are You Sure You Want To '+(chat.forever?'Delete Forever':'Delete')+' chat'+chat.id) === true) crudAction({
        url: `api/messages/${chat.id}`,
        method: 'delete',
        // auth_id: auth.value.id,
        // deleteChat: 1
      }).then(chatsAction({user_chats: myChats.value, user_id: chat.user_id }))
      .catch(e => notifyAction({error: 'deleteChatAction', e}))
    } // TagDeleteChat: chatModule

    return {
      role: computed(() => $store.getters['users/rolesGetter']),
      height: ref(screen.height / 1.4),
      filter: ref(''),
      chatData,
      viewChat,
      url,
      myChats,
      roomId,
      timeago,
      ipDebug,

      admin: [
        'Admin', 'Seller', 'Buyer'
      ],
      seller: [
        'Seller', 'Buyer'
      ],
      getUser(messages) {
        let user; messages.forEach(message => {
          if (message.user.email != auth.value.email) return user = message.user
        }); return user
      }, // getUser
      updateChatAction,
      edit (chat) {
        roomId.value = chat.room_id
        viewChat.value = true
        chatsAction({user_chats: myChats.value, user_id: chat.user_id })
      }, // TagViewChat: chatModule
      Delete, // TagDeleteChat: chatModule
      delete_forever (chat) { // AddPasswordBeforeDeleteForever
        Delete({...chat, ...{forever: 1}})
      },// TagDeleteForever: chatModule

      restore (chat) {
        api.post('api/categories', chat)
        .then(chatsAction({user_chats: myChats.value, user_id: chat.user_id }))
        .catch(e => notifyAction({error: 'restoreChatAction', e}))
      }, // TagRestore: chatModule

      messageExist (chat) {
        try {
          return chat.room.messages[0]
        } catch (e) {return false}
      }, // TagRoomWithMessage: chatModule

      pagination: {
        sortBy: 'asc',
        descending: false,
        page: 1,
        rowsPerPage: 0,
        rowsNumber: 10
      },
      rows: computed(() => chats.value||$store.getters['crud/Getter']),
      columns: [
        { name: 'pic', align: 'center', label: $t('picture'), field: 'pic', sortable: true },
        { name: 'chat_title', align: 'center', label: $t('chat_title'), field: 'name', sortable: true },
        { name: 'address', align: 'center', label: $t('address'), field: 'address', sortable: true },
        { name: 'city', align: 'center', label: $t('city'), field: 'city', sortable: true },
        { name: 'end_date', align: 'center', label: $t('expiry'), field: 'end_date', sortable: true },
        { name: 'edit', align: 'center', label: $t('edit'), field: 'edit', sortable: false },
        { name: 'delete', align: 'center', label: $t('delete'), field: 'delete', sortable: false }
      ]

      // pics () {
      //   try {
      //     return chats.value.chat.pics
      //   } catch { return false }
      // }, // TagShowImage: PicModule
    }
  }
}
</script>

<style scoped>
.my-custom-toggle {
    border: 1px solid #027be3
  }
</style>
