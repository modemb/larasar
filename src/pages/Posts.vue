<template>
  <div class="*q-pa-md">

    <q-dialog v-model="print"><!--============ Receipt PopUp ============-->
      <q-card class="my-card text-black">
        <q-card-section class="bg-primary text-white">
          <q-btn color="primary" text-color="white" class="float-right" dense round icon="close" v-close-popup />
          <!-- <div class="text-h6">{{$t('reports')}}</div> -->
        </q-card-section>

        <Reports :post_reports="post_reports" /><!-- TagPayment: PostReceiptPaymentModule -->
      </q-card>
    </q-dialog><!--=========================== Receipt PopUp End ========-->

    <q-dialog v-model="editPost"><!--============ Edit Post PopUp ===========-->
      <q-card class="my-card *text-white col-1" style="width: 1250px">
          <post :postData="postData" v-on:reload="edit" />
      </q-card><!-- TagEditPost: PostModule -->
    </q-dialog><!--============================= Edit Post PopUp End ========-->

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
                <q-img :src="url+'/'+props?.row?.pics?.[0]?.pic" v-if="props?.row?.pics?.[0]"/>
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
                    <q-icon name='fas fa-receipt'/>
                    {{props.row.start_date}}
                    <q-icon name='fas fa-long-arrow-alt-right'/>
                    {{props.row.end_date}}
                  </q-btn><!-- https://quasar.dev/vue-components/list-and-list-items#example--emails -->
                </q-item-label><!-- TagPayment: PostReceiptPaymentModule -->
                <div class="text-grey-8 q-gutter-xs">
                  <!-- <q-btn class="*gt-xs" size="12px" flat dense :label="$t('receipt')" icon="fas fa-receipt" @click="receipt(props.row)" /> -->
                  <!-- <q-btn class="*gt-xs" size="12px" flat dense :label="$t('edit')" icon="edit" @click="edit(props.row)" /> -->

                  <q-btn dense flat icon="fas fa-eye"
                    title="Views" @click="edit(props.row)"
                    ><q-badge color="orange" text-color="black" :label="props.row.count" floating />
                  </q-btn><!-- TagView: ViewModule v-if="count" -->

                  <q-btn class="*gt-xs" size="12px" flat dense :label="$t('archive_post')" icon="archive" v-if="role.admins" @click="archive(props.row)" />
                  <template v-if="myPosts=='trashed'">
                  <q-btn class="*gt-xs" size="12px" flat dense :label="$t('restore')" icon="restore" @click="restore(props.row)" />
                  <q-btn class="*gt-xs" size="12px" flat dense :label="$t('delete_forever')" icon="delete_forever" @click.prevent="delete_forever(props.row)" />
                  </template><q-btn class="*gt-xs" size="12px" flat dense :label="$t('delete')" icon="delete" v-else @click.prevent="Delete(props.row)" />
                </div><!-- TagDeletePost: PostModule -->
                <small class="timestamp">
                  <!-- <timeago :datetime="props.row.updated_at" :auto-update="60" /> -->
                  {{timeago(props.row.start_date)}}
                </small>
              </q-item-section>

              <q-item-section side v-if="myPosts!='trashed'">
                <div class="text-grey-8 q-gutter-xs"> {{$t('expiry')}}
                  <q-btn rounded :flat="dateDiffIndays(new Date(), props.row.end_date) > 6"
                    :icon="dateDiffIndays(new Date(), props.row.end_date) > 6 ?'':'fas fa-redo'"
                    :label="dateDiffIndays(new Date(), props.row.end_date)+' days'"
                    @click.prevent="dateDiffIndays(new Date(), props.row.end_date) > 6 || renewPost(props.row.id)"
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
          push
          glossy class="*q-ma-xs *col-md-3"
          toggle-color="primary"
          :options="[
            {label: $t('my_posts'), value: 'my_posts'},
            {label: $t('Gallery'), value: 'gallery'},
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

    </q-table>
    <!--============ Data Table End ====================-->

  </div>
</template>

<script>
import { ref, watch, computed } from 'vue'
import { useStore } from 'vuex'
import { i18n, url, timeago, api, crudAction, notifyAction } from 'boot/axios'
import { dateDiffIndays } from '../components/functions'
import Reports from '../components/Reports'
import Post from '../components/Post'

/**
 * Tags: TagDeletePost - TagPayment
 *
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
    const editPost = ref(false)
    const postData = ref({})
    const myPosts = ref('my_posts')
    const post_reports = ref([])
    const print = ref(null)

    const checkout = computed(() => $store.getters['crud/Getter']?.checkout)
    const auth = computed(() => $store.getters['users/authGetter'])

    postsAction({ user_posts: 'my_posts', user_id: auth.value?.id })

    watch([myPosts, checkout], val => postsAction({ user_posts: val[0], user_id: auth.value.id }))

    function postsAction(payload) {
      crudAction({...payload, ...{
        url: 'api/categories/postsAction',
        method: 'get'
      }}).then(crud => $store.commit('categories/postsMutation', crud))
         .catch(e => notifyAction({error: 'postsAction', e}))
    }

    function updatePostAction (payload) {
      return crudAction({...payload, ...{
        url: 'api/categories/updatePostAction',
        method: 'put'
      }})
    }

    function Delete(post) {
      if (confirm('Are You Sure You Want To '+(post.forever?'Delete Forever':'Delete')+' Post'+post.id) === true) crudAction({
        url: `api/categories/${post.id}`,
        method: 'delete',
        auth_id: auth.value.id,
        post: 1
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
      url,
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
      // dateDiffIndays (date1, date2) {
      //   let dt1 = new Date(date1); let dt2 = new Date(date2)
      //   return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) -
      //     Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) / (1000 * 60 * 60 * 24))
      // }, // Date Diff In Days
      updatePostAction,
      renewPost (postID) {
        crudAction({
          url: 'api/categories/renewPost',
          method: 'put',
          // renewPost: 1,
          rank: 1,
          post_id: postID,
          success: 'Post Renewed Successfully'
        }).then(() => {
          // postsAction({ user_id: auth.value.id })
          postsAction({user_posts: myPosts.value, user_id: auth.value.id })
        }).catch(e => notifyAction({error: 'renewPost', e}))
      }, // TagRenewPost: PostModule
      receipt(post) {
        print.value = true
        post_reports.value = post.reports
        // emit('reports', post.reports)
        console.log('post.reports', post.reports)
        // post_title.value = post.post_title
        // payment_Payer_id.value = post.payments[0].PayerID
        // payment_post_id.value = post.payments[0].post_id
        // payment_sale_date.value = post.payments[0].sale_date
        // payment_amount.value = post.payments[0].amount
        // payment_end_date.value = post.payments[0].end_date
        // payment_start_date.value = post.payments[0].start_date
        // payment_currency_code.value = post.payments[0].currency_code
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
      archive (post) {
        if (confirm('Are You Sure You Want To Archive Post') === true) updatePostAction({
          post_id: post.id, // TagArchivePost: PostModule
          user_id: post.user_id,
          post_archive: true,
          success: 'Post Archived Successfully'
        }).then(postsAction({user_posts: myPosts.value, user_id: post.user_id }))
          .catch(e => notifyAction({error: 'archivePostAction', e}))
      },

      restore (post) {
        api.post('api/categories', post)
        .then(postsAction({user_posts: myPosts.value, user_id: post.user_id }))
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
        // { name: 'pic', align: 'center', label: $t('picture'), field: 'pic', sortable: false },
        { name: 'post_title', align: 'center', label: $t('post_title'), field: 'name', sortable: true },
        // { name: 'address', align: 'center', label: $t('address'), field: 'address', sortable: true },
        // { name: 'city', align: 'center', label: $t('city'), field: 'city', sortable: true },
        // { name: 'end_date', align: 'center', label: $t('expiry'), field: 'end_date', sortable: true },
        // { name: 'edit', align: 'center', label: $t('edit'), field: 'edit', sortable: false },
        // { name: 'delete', align: 'center', label: $t('delete'), field: 'delete', sortable: false }
      ],rows: computed(() => $store.getters['categories/postsGetter'])

      // pics () {
      //   try {
      //     return posts.value.post.pics
      //   } catch { return false }
      // }, // TagShowImage: PicModule
      // loading: false,
      // file: null,
      // postSubcategoryLocales: [],
      // post_title: null,
      // post_title_data: null,
      // auth,
      // address: null,
      // address_data: null,
      // city: null,
      // city_data: null,
      // phone: null,
      // phone_data: null,
      // postal_code: null,
      // postal_code_data: null,
      // description: null,
      // description_data: null,
      // update_location: false,
      // loader: false,
      // // images: [],
      // user: [],

      // payment_Payer_id: null,
      // payment_post_id: null,
      // payment_amount: null,
      // payment_sale_date: null,
      // payment_start_date: null,
      // payment_end_date: null,
      // payment_currency_code: null,
      // location: null,
      // location_data: null,

      // print: false,
      // addPost: false,
    }
  }
}
</script>

<style scoped>
.my-custom-toggle {
    border: 1px solid #027be3
  }
</style>
