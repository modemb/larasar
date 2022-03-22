<template>
  <q-layout view="lHh lpr lFf" container style="height: 800px" class="shadow-2 rounded-borders">
    <q-header elevated>
      <q-bar v-if="post">
        <q-icon name="fas fa-photo-video" />
        <div>{{$t('My Library')}}</div>

        <q-space />

        <!-- <q-btn dense flat icon="minimize" />
        <q-btn dense flat icon="crop_square" /> -->
        <q-btn dense flat icon="close" v-close-popup />
      </q-bar>

      <div class="q-pa-sm *q-pl-md row items-center">

        <div class="col-xl-4">
          <q-uploader v-if="upload"
            :factory="storeFiles"
            :label="$t('Batch upload')"
            multiple max-files="10"
            auto-upload batch
          /><!-- TagUpload: FilesModule hide-upload-btn  -->
          <input type="file" v-else
            v-on:change="onImageChange"
            class="*q-ma-lg q-ma-xs col-md-3"
          /><!-- TagUpload: FilesModule -->
        </div><!-- https://quasar.dev/vue-components/uploader#introduction -->
        <div class="col-xl-8 *q-ma-lg *row">

          <q-btn icon="fas fa-cloud-upload-alt" class="*q-mb-md q-ma-xs col-md-2"
            @click.prevent="upload = !upload"
          /><!-- TagUpload: FilesModule -->

          <q-btn-toggle
            v-model="showFiles"
            push
            glossy class="q-ma-xs col-md-2"
            toggle-color="orange"
            :options="[
              {label: $t('My Pics'), value: 1},
              {label: $t('Trash'), value: 0}
            ].concat(role.admins?[{label: $t('all_pics'), value: 'all_pics'}]:[])"
          /><!-- TagPeriod: FilesModule -->

          <q-btn icon="add" class="*q-ma-md q-ma-xs col-md-2"
            @click="add(selectedFiles)"
          /><!-- TagAdd: FilesModule -->
          <q-btn icon="edit" class="*q-ma-md q-ma-xs col-md-2"
            @click="edit(selectedFiles)" v-if="ipDebug"
          /><!-- TagEdit: FilesModule -->
          <q-btn icon="delete" class="*q-mb-md q-ma-xs col-md-2"
            @click.prevent="Delete(selectedFiles)" v-if="showFiles"
          /><!-- TagDelete: FilesModule -->
          <template v-else-if="showFiles!='all_pics'">
            <q-btn icon="restore" class="*q-mb-md q-ma-xs col-md-2"
              @click="restore(selectedFiles)"
            /><!-- TagRestore: FilesModule -->
            <q-btn icon="delete_forever" class="*q-mb-md q-ma-xs col-md-2"
              @click.prevent="delete_forever(selectedFiles)"
            /><!-- TagDeleteForever: FilesModule -->
          </template><!-- <q-separator color="orange" inset /> -->
        </div>

      </div>
    </q-header>

    <q-page-container>
      <q-page class="q-pa-sm">
        <q-table
          :style="'height:' + height + 'px;'" grid
          :card-container-class="cardContainerClass"
          :title="$t('galleries')"
          :rows="rows"
          :columns="columns"
          row-key="name"
          :filter="filter"
          hide-header
          v-model:pagination="pagination"
          :rows-per-page-options="rowsPerPageOptions"

          virtual-scroll
          :virtual-scroll-item-size="48"
        ><!-- https://codepen.io/ontwikkelfabriek/pen/yLXXLQY -->

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

                <q-img :src="url+'/'+props.row.pic" />
                <q-card-section v-html="props.row.name" v-if="props.row.name" />
                <q-checkbox v-model="selectedFiles" :val="props.row.pic" :label="props.row.updated_at" />
                <div :class="selectedFile"></div><!-- TagEdit: FilesModule -->

              </q-card>
            </div>
          </template>
        </q-table>
      </q-page>
    </q-page-container>

  </q-layout>
</template>

<script>
import { useQuasar } from 'quasar'
import { useRoute } from 'vue-router'
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { url, api, ipDebug, crudAction, notifyAction } from 'boot/axios'

/**
 * Tags: selectModule
 *
 * @from
 */
export default {
  props: ['height', 'post'],
  setup (props, { emit }) {
    const $q = useQuasar()
    const $store = useStore()
    const $route = useRoute()
    const rows = ref([])
    // const selectedFile = ref(null)
    const selectedFiles = ref([])
    const showFiles = ref(1)
    const images  = ref([])
    const Items = 0

    const auth = $store.getters['users/authGetter']
    const role = $store.getters['users/rolesGetter']

    const filter = ref('')
    const pagination = ref({
      page: 1,
      rowsPerPage: getItemsPerPage()
    })
    watch(() => $q.screen.name, () => {
      pagination.value.rowsPerPage = getItemsPerPage()
    })

    watch(showFiles, val => {
      crudReload(val==='all_pics'?val:(val?'my_pics':'trashed'))
    }) // https://github.com/Intervention/image

    function crudReload (show) {
      crud({
        // url: `api/categories/1`,
        url: `api/users/${auth.id}`,
        method: 'get',
        auth_id: auth?auth.id:null,
        show: show,
        // update: true
      }).then(() => emit('reload', props.post?'file':$route))
        .catch(e => notifyAction({error: 'onMountedPicsAction', e}))
    } crudReload('my_pics')

    async function crud(data) {
      rows.value = await crudAction(data).catch(e => notifyAction({error: data.error, e}))
      const gridMasonryClass = document.querySelector('.grid-masonry')
      if(gridMasonryClass) gridMasonryClass.style.height = rows.value.length*3+'00px'
    } // TagCrud: CrudModule

    function add (selectedFiles) {
      api({
        url: `api/users/${auth.id}`,
        method: 'put',
        data: {
          post: props.post, // Post Data
          pics: selectedFiles,
          update: true
        }
      }).then(res => {
        crudReload('my_pics')
        notifyAction(res.data)
      }) // Show Picture
      .catch(e => notifyAction({error: 'storeImageAction', e}))
    } // TagAdd: FilesModule

    function cruDelete (selectedFiles) {
      console.log('cruDelete', selectedFiles)
      return crud ({
        error: 'DeletePicsAction',
        url: `api/users/${auth.id}`,
        method: 'delete',
        auth: auth||null,
        forever: selectedFiles.forever,
        pics: selectedFiles
      })
    }

    function storeFiles (files) {
      for (let i = 0; i < files.length; i++) {
        let reader = new FileReader()
        reader.onload = e => {
          images.value.push(e.target.result)
          if (i+1 === files.length) setTimeout(() =>
            add(images.value), images.value.length*500)
        }; reader.readAsDataURL(files[i])
      } images.value = [] // https://www.positronx.io/understand-html5-filereader-api-to-upload-image-and-text-files/
    } // TagUpload: FilesModule

    function getItemsPerPage () {
      // if ($q.screen.lt.sm) {
      //   return 3
      // }
      // if ($q.screen.lt.md) {
      //   return 6
      // }
      // return 9
      return Items
    }

    return {
      rows,
      url,
      filter,
      pagination,
      auth,
      role,
      ipDebug,
      upload: ref(false),
      // selectedFile,
      selectedFiles,
      showFiles,

      add,
      storeFiles,

      // edit (selectedFiles) {
      //   selectedFiles.forEach(selectedFile => {
      //     // let test = document.getElementsByClassName(selectedFile)//.innerHTML =1
      //     let test = document.querySelector(`.${selectedFile}`)//.innerHTML = 1
      //     // console.log('test', test)
      //     // `<q-input color="teal" outlined v-model="text" label="Label" v-if="selectedFiles">
      //     //   <template v-slot:append>
      //     //     <q-btn class="*glossy"
      //     //       flat :loading="loader"
      //     //       icon="fas fa-edit"
      //     //       @click.prevent="edit(text)"
      //     //     /><!-- TagEdit: FilesModule -->
      //     //   </template>
      //     // </q-input>`
      //   })
      // },// TODO TagEdit: FilesModule

      onImageChange (e) {
        let files = e?.target?.files || e?.dataTransfer?.files
        if (!files.length) return; storeFiles(files)
      }, // TagUpload: FilesModule

      restore (selectedFiles) {
        crud ({
          error: 'restorePicsAction',
          url: 'api/users',
          method: 'post',
          // auth_id: auth?auth.id:null,
          // pics: selectedFiles,
          restorePics: selectedFiles
          // pic: true
        }).then(() => crudReload('trashed'))
      }, // TagRestore: FilesModule

      Delete (selectedFiles) {
        selectedFiles.forever = 0
        if (confirm('Are You Sure You Want To Delete Pics') === true)
        cruDelete(selectedFiles).then(() => crudReload((showFiles.value === 'all_pics')?'all_pics':'my_pics'))
      }, // TagDelete: FilesModule

      delete_forever (selectedFiles) {
        selectedFiles.forever = 1
        if (confirm('Are You Sure You Want To Delete Forever Pics') === true)
        cruDelete(selectedFiles).then(() => crudReload('trashed'))
        // AddPasswordBeforeDeleteForever
      }, // TagDeleteForever: FilesModule: FilesModule

      columns: [
        // { name: 'pic', align: 'center', label: ('picture'), field: 'pic', sortable: true },
        // { name: 'post_title', align: 'center', label: ('post_title'), field: 'name', sortable: true },
        // { name: 'address', align: 'center', label: ('address'), field: 'address', sortable: true },
        // { name: 'city', align: 'center', label: ('city'), field: 'city', sortable: true },
        // { name: 'end_date', align: 'center', label: ('expiry'), field: 'end_date', sortable: true },
        // { name: 'edit', align: 'center', label: ('edit'), field: 'edit', sortable: false },
        // { name: 'delete', align: 'center', label: ('delete'), field: 'delete', sortable: false }
      ],

      cardContainerClass: computed(() => {
        return $q.screen.gt.xs
          ? 'grid-masonry grid-masonry--' + ($q.screen.gt.sm ? '3' : '2')
          : null
      }),

      rowsPerPageOptions: computed(() => {
        return [0]
        return $q.screen.gt.xs
          // ? $q.screen.gt.sm ? [ 3, 6, 9 ] : [ 3, 6 ]
          // : [3]
          ? $q.screen.gt.sm ? [ Items, 6, 9 ] : [ Items, 6 ]
          : [Items]
      })
    }
  }
}
</script>
