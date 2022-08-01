<template>
  <div class="*q-pa-md">
    <!--============ Data Table ========================-->
    <q-table
      hide-header
      :style="'height:' + height + 'px'"
      ref="table"
      :title="$t('favorites')"
      :rows="rows"
      :columns="columns"
      row-key="id"
      virtual-scroll
      :virtual-scroll-item-size="48"
      :rows-per-page-options="[0]"

      :filter="filter"
      binary-state-sort

    ><!-- @request="onRequest" -->

      <template v-slot:body="props">
        <div class="q-pa-md q-gutter-md">
          <q-list bordered class="rounded-borders" style="max-width: 1600px">
            <q-item>
              <q-item-section style="max-width: 150px; max-height: 150px;">
                <q-img :src="url+'/'+props.row?.pics?.[0]?.pic" v-if="props.row?.pics?.[0]"/>
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
                <small class="timestamp">
                  <timeago :datetime="props.row.created_at" :auto-update="60" />
                </small>
              </q-item-section>

              <q-item-section side>
                <div class="text-grey-8 q-gutter-xs">
                  <q-btn class="*gt-xs" size="12px" flat dense :label="$t('remove')" icon="delete" @click.prevent="remove(props.row)" />
                </div><!-- TagRemove: FavoriteModule -->
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </template>
      <template v-slot:top-right>
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
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { i18n, url, crudAction, notifyAction } from 'boot/axios'
// import { i18n } from 'boot/i18n'

/**
 * Tags: TagDeletePost - TagPayment - FavoriteModule
 *
 * @from CategoryController
 */
export default {
  setup () {
    const $store = useStore()
    const $t = i18n?.global?.t
    const rows = ref([])

    const auth = computed(() => $store.getters['users/authGetter'])

    onMounted(() => {
      crudAction({
        url: 'api/categories/' + auth.value.id,
        method: 'get',
        favorite: true // TagFavorite: FavoriteModule
      }).then(crud => {rows.value = crud})
        .catch(e => notifyAction({error: 'favoriteMounted', e}))
    })

    return {
      // crudAction,
      // postSubcategoryLocales: [],
      // post_title: null,
      // post_title_data: null,
      // auth: null,
      // address: null,
      // address_data: null,
      // city: null,
      // city_data: null,
      // phone: null,
      // phone_data: null,
      // postal_code: null,
      // postal_code_data: null,
      // loader: false,
      // images: [],
      // post: [],
      // user: [],
      // loading: false,
      // file: null,

      height: ref(screen.height / 1.4),
      filter: ref(''),
      url,

      remove (post) {
        if (confirm('Are You Sure You Want To Remove Post From Favorite ' + post.id) === true) {
          crudAction({
            // error: 'removeFavorite',
            url: 'api/categories/' + post.favorite_id,
            auth_id: auth.value.id,
            method: 'delete',
            favorite: true
          }).then(crud => { rows.value = crud })
            .catch(e => notifyAction({error: 'removeFavorite', e}))
        }
      }, // TagRemove: FavoriteModule

      // rowCount: 10,
      // pagination: {
      //   sortBy: 'asc',
      //   descending: false,
      //   page: 1,
      //   rowsPerPage: 0,
      //   rowsNumber: 10
      // },
      rows,
      columns: [
        { name: 'pic', align: 'center', label: $t('picture'), field: 'pic', sortable: true },
        { name: 'post_title', align: 'center', label: $t('post_title'), field: 'name', sortable: true },
        { name: 'address', align: 'center', label: $t('address'), field: 'address', sortable: true },
        { name: 'city', align: 'center', label: $t('city'), field: 'city', sortable: true },
        { name: 'end_date', align: 'center', label: $t('expiry'), field: 'end_date', sortable: true },
        { name: 'edit', align: 'center', label: $t('edit'), field: 'edit', sortable: false },
        { name: 'remove', align: 'center', label: $t('remove'), field: 'remove', sortable: false }
        // { name: 'delete', align: 'center', label: $t('delete'), field: 'delete', sortable: false }
      ],
    }
  }
}
</script>

<style scoped>
.my-custom-toggle {
    border: 1px solid #027be3
  }
</style>
