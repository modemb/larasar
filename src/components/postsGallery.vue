<template>
  <q-dialog v-model="view"><!--============ Edit Post PopUp ===========-->
    <q-card class="my-card col-1" style="width:1000px">
        <post :postData="postData" />
    </q-card><!-- TagEditPost: PostModule -->
  </q-dialog><!--========================== Edit Post PopUp End =======-->
  <div class="q-pa-md">
    <q-table
      :style="'height:' + height + 'px;'" grid
      :card-container-class="cardContainerClass"
      :title="$t('gallery')"
      :rows="rows"
      :columns="columns"
      row-key="name"
      :filter="filter"
      hide-header
      v-model:pagination="pagination"
      :rows-per-page-options="rowsPerPageOptions"

      virtual-scroll
      :virtual-scroll-item-size="48"
    ><!-- https://codepen.io/ontwikkelfabriek/pen/yLXXLQY
      :virtual-scroll-sticky-size-start="48"
      -->
      <template v-slot:top-right>
        <q-input clearable borderless dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
          <q-card class="my-card">
            <div style="cursor: pointer;" @click="viewPost(props.row)">
              <q-img :src="baseURL+'/'+pic" v-if="pic=props.row.pics?.[0]?.pic" class="rounded-borders"/>
              <q-icon name="far fa-image" color="black" size="150px" v-else/>
            </div>
            <q-card-section class="row">
              <div class="col-12 *ellipsis">
                <q-btn color="primary"
                  :to="`/post/${props.row.id}`"
                  :label="props.row.post_title"
                /><!-- {{props.row.post_title}} -->
              </div><!-- Post Title -->
              <div class="col-6 q-mt-md" v-if="(price=props.row.price)>0">
                {{Number(price).toLocaleString(locale, { style: 'currency', currency: props.row.currency_code||'USD' })}}
              </div><div class="col-6" v-else /><!--  -->
              <div class="col-6">
                <wish fab :post="props.row" v-on:favorite="wish"/>
              </div><!-- TagFavorite: FavoriteModule -->
            </q-card-section>
          </q-card><!-- adCard -->
        </div>
      </template>
    </q-table>
  </div>
</template>

<script lang="ts">
import { useQuasar } from 'quasar'
import { ref, computed, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import { baseURL } from 'boot/axios'
import Wish from './UserWish.vue'
import Post from './UserPost.vue'
import { useCrudStore } from 'stores/crud'

/**
 * Tags: FavoriteModule - LocationModule
 *
 * @from
 */
export default {
  props: ['height'],
  components: {
    Wish,
    Post
  },
  setup () {
    const $q = useQuasar()
    const $store = useStore()
    const store = useCrudStore()
    const { crudAction, notifyAction } = store
    const postData = ref({})
    const Crud = ref([])
    const view = ref(false)
    const Items = 0

    const location = computed(() => $store.getters['users/locationGetter'])
    const distance = computed(() => $store.getters['users/distanceGetter'])
    const locale = computed(() => $store.getters['config/localeGetter'])
    const auth = computed(() => $store.getters['users/authGetter'])
    const rows = computed(() => store['galleryGetter']||Crud.value)
    const reload = computed(() => store['reload']?.reload)

    function getItemsPerPage () {
      if (Items !== undefined) return Items
      if ($q.screen.lt.sm) return 3
      if ($q.screen.lt.md) return 6
      if ($q.screen.lt.lg) return 9
    }

    const pagination = ref({
      page: 1,
      rowsPerPage: getItemsPerPage()
    })

    watch(() => $q.screen.name, () => pagination.value.rowsPerPage = getItemsPerPage())
    watch([location, distance, reload], () => gallery())
    watch(rows, val => gridMasonry(val))

    function gallery() {
      crudAction({ ...distance.value, ...{
        url: 'api/categories/gallery',
        method: 'get',
        mutate: 'galleryGetter',
        auth_id: auth.value?.id,
        locale: locale.value,
        loc: location.value
      }}).then((crud: never[]) => Crud.value=crud)
         .catch((e: string) => notifyAction({error: 'GalleryAction', e}))
    } onMounted(() => gridMasonry(rows.value))

    function gridMasonry(val: object[]) {
      const gridMasonryClass = document.querySelector('.grid-masonry')
      if (gridMasonryClass) gridMasonryClass.style.height = val?.length*200+'px'
      if (!val?.length) gallery() // console.log(gridMasonryClass, val.length*200+'px', 'gridMasonry', !val.length)
    }

    return {
      auth,
      filter: ref(''),
      baseURL,
      pagination,
      postData,
      view,
      locale,

      viewPost(post: object) {
        postData.value = post; view.value = true
      },

      wish() { gallery() }, // TagFavorite: FavoriteModule

      columns: [
        { name: 'post_title', align: 'center', label: ('post_title'), field: 'post_title', sortable: true },
        { name: 'description', align: 'center', label: ('description'), field: 'description', sortable: true },
        { name: 'address', align: 'center', label: ('address'), field: 'address', sortable: true },
        { name: 'city', align: 'center', label: ('city'), field: 'city', sortable: true },
        // { name: 'pic', align: 'center', label: ('picture'), field: 'pic', sortable: false },
        // { name: 'end_date', align: 'center', label: ('expiry'), field: 'end_date', sortable: false },
        // { name: 'edit', align: 'center', label: ('edit'), field: 'edit', sortable: false },
        // { name: 'delete', align: 'center', label: ('delete'), field: 'delete', sortable: false }
      ], rows,

      cardContainerClass: computed(() => {
        return $q.screen.gt.xs
          ? 'grid-masonry grid-masonry--' + ($q.screen.gt.sm ? '3' : '2')
          : null
      }),

      rowsPerPageOptions: computed(() => {
        if (Items !== undefined) return [Items]
        return $q.screen.gt.xs
          ? $q.screen.gt.sm ? [ 3, 6, 9 ] : [ 3, 6 ]
          : [3]
          // ? $q.screen.gt.sm ? [Items, 6, 9] : [Items, 6]
          // : [Items]
      })
    }
  }
}
</script>

<style lang="sass" scoped>
.grid-masonry
  flex-direction: column
  height: 700px
  // height: 15000px

//   &--2
//     > div
//       &:nth-child(2n + 1)
//         order: 1
//       &:nth-child(2n)
//         order: 2

//     &:before
//       content: ''
//       flex: 1 0 100% !important
//       width: 0 !important
//       order: 1
//   &--3
//     > div
//       &:nth-child(3n + 1)
//         order: 1
//       &:nth-child(3n + 2)
//         order: 2
//       &:nth-child(3n)
//         order: 3

//     &:before,
//     &:after
//       content: ''
//       flex: 1 0 100% !important
//       width: 0 !important
//       order: 2
</style>
