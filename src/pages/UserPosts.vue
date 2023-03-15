<template>
  <div>

    <q-dialog v-model="print"><!--============ Receipt PopUp ============-->
      <q-card class="my-card text-black">
        <q-card-section class="bg-primary text-white">
          <q-btn color="primary" text-color="white" class="float-right" dense round icon="close" v-close-popup />
          <!-- <div class="text-h6">{{$t('reports')}}</div> -->
        </q-card-section>

        <Reports :post_reports="post_reports" /><!-- TagPayment: PostReceiptPaymentModule -->
      </q-card>
    </q-dialog><!--=========================== Receipt PopUp End ========-->

    <q-dialog v-model="editPost"><!--========= Edit Post PopUp ==========-->
      <q-card class="my-card col-1" style="width: 1250px">
          <post :postData="postData" :myPosts="myPosts" v-on:reload="edit" />
      </q-card><!-- TagEditPost: PostModule -->
    </q-dialog><!--=========================== Edit Post PopUp End =======-->

    <!--============ Data Table ========================-->
    <q-table
      hide-header
      :style="'height:' + height + 'px'"
      ref="table"
      :title="$t('posts_list')"
      :rows="rows"
      :columns="columns"
      row-key="name"
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
        <div class="q-pa-md q-gutter-md">
          <q-list bordered class="rounded-borders ellipsis" style="max-width: 1600px">
            <q-item>
              <q-item-section style="max-width: 150px; max-height: 150px;">
                <q-img :src="baseURL+'/'+props?.row?.pics?.[0]?.pic" v-if="props?.row?.pics?.[0]"/>
                <q-icon name="fas fa-plus-circle" color="black" size="150px" v-else/>
              </q-item-section>

              <!-- <q-item-section top class="col-2 gt-sm">
                <q-item-label class="q-mt-sm">GitHub</q-item-label>
              </q-item-section> -->

              <q-item-section>
                <q-item-label lines="1">
                  <span class="text-weight-medium">{{props.row.city}}</span>
                  <span class="text-grey-8"> {{props.row.postal_code}}</span>
                </q-item-label>
                <q-item-label lines="1" class="q-mt-xs text-body2 text-weight-bold text-primary text-uppercase">
                  <!-- <span class="cursor-pointer">Open in GitHub</span> -->
                  <q-btn flat dense :label="props.row.post_title" :to="'/post/' + props.row.id" />
                </q-item-label>
                <q-item-label caption lines="1">
                  <q-btn size="12px" flat dense @click="receipt(props.row)">
                    <i class='q-pa-md fas fa-receipt'/>
                    <!-- {{props.row?.payments?.[0]?.start_date}} -->
                    {{props.row.start_date}}
                    <i class='q-pa-md fas fa-long-arrow-alt-right'/>
                    <!-- {{props.row?.payments?.[0]?.end_date}} -->
                    {{props.row.end_date}}
                  </q-btn><!-- https://quasar.dev/vue-components/list-and-list-items#example--emails -->
                </q-item-label><!-- TagPayment: PostReceiptPaymentModule -->
                <div class="text-grey-8 q-gutter-xs">

                  <q-btn dense flat icon="fas fa-eye"
                    title="Views" @click="edit(props.row)"
                    ><q-badge color="orange" text-color="black" :label="props.row.count" floating />
                  </q-btn><!-- TagView: ViewModule v-if="count" -->

                  <q-btn size="12px" flat dense :label="$t('Publish Post')" icon="upload" v-if="!props.row.end_date" @click="renewPost(props.row.id)" />
                  <q-btn size="12px" flat dense :label="$t('archive_post')" icon="archive" v-else-if="role.admins" @click="archive(props.row)" />
                  <template v-if="myPosts=='trashed'">
                  <q-btn size="12px" flat dense :label="$t('restore')" icon="restore" @click="restore(props.row)" />
                  <q-btn size="12px" flat dense :label="$t('delete_forever')" icon="delete_forever" @click.prevent="delete_forever(props.row)" />
                  </template><q-btn size="12px" flat dense :label="$t('delete')" icon="delete" v-else @click.prevent="Delete(props.row)" />
                </div><!-- TagDeletePost: PostModule -->
                <small class="timestamp"><!-- <timeago :datetime="props.row.updated_at" :auto-update="60" /> -->
                  {{timeago(props.row.start_date)}}
                </small>
              </q-item-section>

              <q-item-section side v-if="myPosts!='trashed'">
                <div class="text-grey-8 q-gutter-xs"> {{$t('expiry')}}
                  <q-btn rounded :flat="dateDiffIndays(Date(), props.row.end_date) > 6"
                    :icon="dateDiffIndays(Date(), props.row.end_date) > 6 ?'':'fas fa-redo'"
                    :label="dateDiffIndays(Date(), props.row.end_date)+' days'"
                    @click.prevent="dateDiffIndays(Date(), props.row.end_date) > 6 || renewPost(props.row.id)"
                  /><!-- TagRenewPost: PostModule -->
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </template>
      <template v-slot:top-right>
        <q-btn-toggle
          v-model="myPosts"
          push glossy
          toggle-color="primary"
          :options="[
            {label: $t('my_posts'), value: 'my_posts'},
            {label: $t('gallery'), value: 'gallery'},
            {label: $t('Expired Posts'), value: 'expired_posts'},
            {icon: 'restore', value: 'trashed'}
          ]"
        /><!-- TagPeriod: PeriodModule -->
        <q-btn-toggle
          v-model="myPosts"
          class="my-custom-toggle q-ma-md"
          no-caps push
          rounded glossy
          unelevated v-if="role.admins"
          toggle-color="primary"
          color="white"
          text-color="primary"
          :options="[
            {icon: 'flag', value: 'flag'},
            {label: $t('all'), value: 'all_posts'}
          ]"
        /><!-- </div>TagMyPost: PostModule -->
        <q-input borderless dense debounce="300" v-model="filter" :placeholder="$t('search')">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <!--<q-btn
          icon="add_circle_outline"
          rounded class="q-ma-md"
          :label="$t('add_user')"
          @click="addPost = true, editPost = false, post_title = address = city = postal_code = description = null"
        /> TagAdd: UserModule -->
      </template>

    </q-table><!--== Data Table End ====================-->

  </div>
</template>

<script>
import { ref, watch, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { i18n, timeago, api, baseURL } from 'boot/axios'
import { useCrudStore } from 'stores/crud'
import { dateDiffIndays } from 'components/Functions.ts'
import Reports from 'src/components/UserReports.vue'
import Post from 'components/UserPost.vue'

/**
 * Tags: TagDeletePost - TagPayment - TagPublishPost - TagRenewPost
 *
 * @from CategoryController
 */
export default {
  components: {
    Reports,
    Post // edit-post
  },
  setup () {
    const $t = i18n.global.t
    const $store = useStore()
    const store = useCrudStore()
    const { crudAction, notifyAction } = store
    const editPost = ref(false)
    const postData = ref({})
    const myPosts = ref('my_posts')
    const getters = ref('my_posts')
    const post_reports = ref([])
    const print = ref(null)
    const Crud = ref(null)

    const auth = computed(() => $store.getters['users/authGetter'])
    const reload = computed(() => store['reload']?.reload)
    const flag = computed(() => store['flag']?.flag)
    const rows = computed(() => (store[getters.value]||Crud.value)?.filter(post => {
      if (myPosts.value === 'all_posts') return post
      if (myPosts.value === 'trashed') return post.deleted_at
      if (myPosts.value === 'expired_posts') return new Date(post.end_date).getTime() < Date.now()
      if (myPosts.value === 'gallery') return post.gallery_page === 1
      if (myPosts.value === 'flag') return post.state === 1
      if (myPosts.value === 'my_posts') return post.end_date === null ||
        new Date(post.end_date).getTime() > Date.now() & post.user_id === auth.value.id
    }))

    onMounted(() => postsAction({ user_posts: 'my_posts', user_id: auth.value?.id }))

    watch([myPosts, reload, flag], val => postsAction({ user_posts: val[0], user_id: auth.value?.id }))

    function postsAction(payload) {
      getters.value = payload.user_posts
      crudAction({...payload, ...{
        url: 'api/categories/postsAction',
        method: 'get', mutate: payload.user_posts
      }}).then(crud => Crud.value = crud)
         .catch(e => notifyAction({error: 'postsAction', e}))
    }

    function Delete(post) {
      if (confirm('Are You Sure You Want To '+(post.forever?'Delete Forever':'Delete')+' Post'+post.id) === true) crudAction({
        url: `api/categories/${post.id}`,
        method: 'delete', post: 1,
        auth_id: auth.value.id
      }).then(() => postsAction({user_posts: myPosts.value, user_id: post.user_id }))
        .catch(e => notifyAction({error: 'deletePostAction', e}))
    } // TagDeletePost: PostModule

    return {
      role: computed(() => $store.getters['users/rolesGetter']),
      height: ref(screen.height / 1.4),
      filter: ref(''),
      timeago,
      postData,
      editPost,
      baseURL,
      myPosts,
      print,
      post_reports,

      // rowCount: 10,
      admin: [
        'Admin', 'Seller', 'Buyer'
      ],
      seller: [
        'Seller', 'Buyer'
      ], dateDiffIndays,
      // updatePostAction,
      renewPost(postID) {
        crudAction({
          success: 'Post Renewed Successfully',
          url: 'api/categories/renewPost',
          method: 'put', rank: 1,
          post_id: postID
        }).then(() => postsAction({user_posts: myPosts.value, user_id: auth.value.id }))
          .catch(e => notifyAction({error: 'renewPost', e}))
      }, // TagRenewPost - TagPublishPost: PostModule
      receipt(post) {
        print.value = true
        post_reports.value = post.reports
      }, // TagPayment: PostReceiptPaymentModule
      edit (post) {
        postData.value = post
        editPost.value = true
        postsAction({user_posts: myPosts.value, user_id: post.user_id })
      }, // TagEditPost: PostModule
      Delete, // TagDeletePost: PostModule
      delete_forever(post) { // AddPasswordBeforeDeleteForever
        Delete({...post, ...{forever: 1}})
      },// TagDeleteForever: PostModule
      archive(post) {
        if (confirm('Are You Sure You Want To Archive Post') === true) crudAction({
          url: 'api/categories/archive',
          method: 'put',
          post_id: post.id, // TagArchivePost: PostModule
          user_id: post.user_id,
          post_archive: true,
          success: 'Post Archived Successfully'
        }).then(() => postsAction({user_posts: myPosts.value, user_id: post.user_id }))
          .catch(e => notifyAction({error: 'archivePostAction', e}))
      },

      restore(post) {
        api.post('api/categories', post)
        .then(() => postsAction({user_posts: myPosts.value, user_id: post.user_id }))
        .catch(e => notifyAction({error: 'restorePostAction', e}))
      }, // TagRestore: postModule

      pagination: {
        sortBy: 'asc',
        descending: false,
        page: 1,
        rowsPerPage: 0,
        rowsNumber: 10
      },

      columns: [
        { name: 'post_title', align: 'center', label: $t('post_title'), field: 'post_title', sortable: true },
        { name: 'description', align: 'center', label: ('description'), field: 'description', sortable: true },
        { name: 'address', align: 'center', label: $t('address'), field: 'address', sortable: true },
        { name: 'city', align: 'center', label: $t('city'), field: 'city', sortable: true },
        { name: 'end_date', align: 'center', label: $t('expiry'), field: 'end_date', sortable: true },
        // { name: 'pic', align: 'center', label: $t('picture'), field: 'pic', sortable: false },
        // { name: 'edit', align: 'center', label: $t('edit'), field: 'edit', sortable: false },
        // { name: 'delete', align: 'center', label: $t('delete'), field: 'delete', sortable: false }
      ],rows
    }
  }
}
</script>

<style scoped>
.my-custom-toggle {
    border: 1px solid #027be3
  }
</style>
