<template>
  <q-dialog v-model="view"><!--============ Edit Post PopUp ===========-->
    <q-card class="my-card *text-white col-1" style="width:1000px">
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
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
          <q-card class="my-card">
            <div style="cursor: pointer;" @click="viewPost(props.row)">
              <q-img :src="url+'/'+pic" v-if="pic=props.row.pics?.[0]?.pic"/>
              <q-icon name="far fa-image" color="black" size="150px" v-else/>
            </div>

            <!-- <q-list> -->
              <!-- <q-item @click="viewPost(props.row)">
                <q-img :src="url+'/'+pic" v-if="pic=props.row.pics?.[0]?.pic"/>
                <q-icon name="far fa-image" color="black" size="150px" v-else/>
              </q-item> -->

              <q-card-section>
                <wish fab :post="props.row" v-on:favorite="wish"
                  style="top: 0; right: 12px; transform: translateY(-50%);"
                /><!-- TagFavorite: FavoriteModule -->

                <div class="row no-wrap items-center">
                  <div class="col text-h6 ellipsis">
                    <q-btn :to="`/post/${props.row.id}`"
                      :label="props.row.post_title" flat
                    /><!-- {{props.row.post_title}} -->
                  </div>
                </div>
              </q-card-section>

              <q-card-section vertical align="right">
                <!-- <q-btn @click="viewPost(props.row)"
                  flat class="float-right" icon="fas fa-eye"
                  :style="`top: ${0}px; right: 12px; transform: translateY(-50%);`"
                />TagFavorite: FavoriteModule -->

                <div  v-if="(price=props.row.price)>0">${{price}}</div>
              </q-card-section>
            <!-- </q-list> -->
          </q-card><!-- adCard -->
        </div>
      </template>
    </q-table>
  </div>
</template>

<script>
import { useQuasar } from 'quasar'
import { ref, computed, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import { crudAction, notifyAction } from 'boot/axios'
import { url } from 'boot/axios'
import Wish from './Wish'
import Post from './Post'

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
    const postData = ref({})
    const view = ref(false)
    const Items = 0

    const checkout = computed(() => $store.getters['crud/Getter']?.checkout)
    const rows = computed(() => $store.getters['categories/galleryGetter'])
    const location = computed(() => $store.getters['users/locationGetter'])
    const distance = computed(() => $store.getters['users/distanceGetter'])
    const locale = computed(() => $store.getters['config/localeGetter'])
    const auth = computed(() => $store.getters['users/authGetter'])

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
    watch([location, distance, checkout], () => gallery())
    watch(rows, val => gridMasonry(val))

    function gallery() {
      crudAction({ ...distance.value, ...{
        url: 'api/categories/gallery',
        method: 'get',
        auth_id: auth.value?.id,
        locale: locale.value,
        loc: location.value,
        // gallery: true
      }}).then(crud => $store.commit('categories/galleryMutation', crud))
         .catch(e => notifyAction({error: 'GalleryAction', e}))
    } onMounted(() => gridMasonry(rows.value))

    function gridMasonry(val) {
      const gridMasonryClass = document.querySelector('.grid-masonry')
      if (gridMasonryClass) gridMasonryClass.style.height = val.length*200+'px'
      if (!val.length) gallery()
      // console.log(gridMasonryClass, val.length*200+'px', 'gridMasonry', !val.length)
    }

    return {
      auth,
      filter: ref(''),
      url,
      pagination,
      postData,
      view,

      viewPost(post) {
        postData.value = post; view.value = true
      },

      wish () { gallery() }, // TagFavorite: FavoriteModule

      columns: [
        // { name: 'pic', align: 'center', label: ('picture'), field: 'pic', sortable: false },
        { name: 'post_title', align: 'center', label: ('post_title'), field: 'post_title', sortable: true },
        // { name: 'address', align: 'center', label: ('address'), field: 'address', sortable: true },
        // { name: 'city', align: 'center', label: ('city'), field: 'city', sortable: true },
        // { name: 'end_date', align: 'center', label: ('expiry'), field: 'end_date', sortable: true },
        // { name: 'edit', align: 'center', label: ('edit'), field: 'edit', sortable: false },
        // { name: 'delete', align: 'center', label: ('delete'), field: 'delete', sortable: false }
      ],rows,

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
// .grid-masonry
//   flex-direction: column
//   height: 700px
//   // height: 15000px

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
