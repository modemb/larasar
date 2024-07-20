<template>
  <q-layout view="lHh lpr lFf" container style="height: 800px" class="shadow-2 rounded-borders">
    <q-header elevated>
      <q-bar v-if="post||avatar">
        <q-icon name="fas fa-photo-video" />
        <div>{{$t('My Library')}}</div>

        <q-space />

        <!-- <q-btn dense flat icon="minimize" />
        <q-btn dense flat icon="crop_square" /> -->
        <q-btn dense flat icon="close" v-close-popup />
      </q-bar><!-- -->

      <div class="q-pa-sm row items-center" v-if="!avatar||ipDebug">

        <div class="col-xl-4" v-if="post||ipDebug"><!-- -->

          <q-btn color="primary" icon="fas fa-camera" @click="takePhoto" v-if="mobileApp"/>
          <q-uploader v-if="upload"
            :factory="readFiles"
            :label="$t('Batch upload')"
            multiple max-files="10"
            auto-upload batch
          /><!-- TagUpload: FileModule hide-upload-btn -->

          <q-input filled multiple type="file"
            hint="Native file (multiple)" dark
            @update:model-value="(val: any) => readFiles(val)"
          /><!-- https://quasar.dev/vue-components/input#example--input-of-file-type -->

        </div><!-- https://quasar.dev/vue-components/uploader#introduction -->

        <div class="col-xl-8">

          <q-btn class="q-ma-xs col-md-2" icon="fas fa-cloud-upload-alt"
            @click.prevent="upload = !upload"  v-if="ipDebug"
          /><!-- TagUpload: FileModule !mobileApp-->

          <q-btn-toggle
            v-model="showFiles"
            push
            glossy class="q-ma-xs *col-xs-2 *col-md-2"
            toggle-color="orange"
            :options="[
              {label: $t('My Pics'), value: 'my_pics'},
              {label: $t('Trash'), value: bool?'all_trashed_pics':'trashed_pics'}
            ].concat(ipDebug||(auth?.role==='Admin')?[
              {label: $t('Users Pics'), value: 'users_pics'},
              {label: $t('Avatars'), value: 'avatars'},
              {label: $t('All Pics'), value: 'all_pics'}
            ]:[])"
          /><!-- TagPeriod: FileModule -->

          <q-toggle v-if="(ipDebug&&(showFiles==='trashed_pics')||(showFiles==='all_trashed_pics'))"
            :icon="'fas fa-user'+(bool?'s':'')"
            :val="[true]" size="xl" v-model="bool"
          />

          <q-btn icon="fas fa-file-import" v-if="post"
            :class="(selectedFiles?.length?'bg-orange':'')+' q-ma-xs col-md-2'"
            @click="storeFiles(selectedFiles)"
          /><!-- TagAdd: FileModule -->
          <q-btn icon="edit" class="q-ma-xs col-md-2"
            label="restore all" v-if="ipDebug"
            @click="restoreAll"
          /><!-- TagEdit: FileModule -->
          <q-btn icon="delete" v-if="(showFiles!=='trashed_pics')&&(showFiles!=='all_trashed_pics')"
            :class="(selectedFiles?.length?'bg-orange':'')+' q-ma-xs col-md-2'"
            @click.prevent="Delete(selectedFiles)"
          /><!-- TagDelete: FileModule -->
          <template v-else>
            <q-btn icon="restore"
              :class="(selectedFiles?.length?'bg-orange':'')+' q-ma-xs col-md-2'"
              @click="restore(selectedFiles)"
            /><!-- TagRestore: FileModule -->
            <q-btn icon="delete_forever"
              :class="(selectedFiles?.length?'bg-orange':'')+' q-ma-xs col-md-2'"
              @click.prevent="delete_forever(selectedFiles)"
            /><!-- TagDeleteForever: FileModule -->
          </template><!-- <q-separator color="orange" inset /> -->
        </div>

      </div>
    </q-header>

    <q-page-container>
      <q-page class="q-pa-sm">
        <q-table
          _:style="'height:' + height + 'px;'" grid
          :card-container-style="cardContainerStyle"
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
        ><!-- https://codepen.io/ontwikkelfabriek/pen/yLXXLQY -->

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

                <q-img :src="props.row?.avatar?.includes('https') ? props.row.avatar :
                                    baseURL+'/'+(props.row.pic||props.row.avatar)" />
                <div v-html="props.row.name" v-if="props.row.name" />
                <q-checkbox v-model="selectedFiles"
                  :val="props.row.pic"
                  :label="props.row.updated_at||props.row.id"
                /><!-- selectModule -->
                <q-btn size="12px" flat dense icon="fas fa-sign-in-alt"
                  :label="$t('Log User')" v-if="ipDebug"
                  @click.prevent="logUserAction(props.row.user_id||props.row.id)"
                /><!-- TagLogUser: UserModule -->
                <q-btn v-if="(showFiles!=='trashed_pics'&&showFiles!=='all_trashed_pics')&&selectedFiles?.length"
                  :label="$t('delete')" size="12px" icon="fas fa-trash"
                  @click.prevent="deletePic(props.row.id)" flat dense
                /><!-- TagDeletePic: UserModule -->
              </q-card>
            </div>
          </template>
        </q-table>
      </q-page>
    </q-page-container>

  </q-layout>
</template>

<script lang="ts">
import { useQuasar } from 'quasar'
import { useRoute } from 'vue-router'
import { ref, computed, watch, onMounted } from 'vue'
import { api, baseURL, mobileApp, logUserAction, authAction, filesMutation } from 'boot/axios'
import { capacitor, takePicture } from './Functions'
import { useCrudStore } from 'stores/crud'

/**
 * Tags: selectModule
 *
 * @to
 */
export default {
  props: ['height', 'avatar', 'post'],
  setup (props, { emit }) {
    const $q = useQuasar()
    const store = useCrudStore()
    const { crudAction, notifyAction } = store
    const $route = useRoute()
    const selectedFiles = ref<any>([])
    const showFiles = ref('my_pics')
    const Items = 0

    const auth = computed(() => store.authGetter)
    const files = computed(() => store.filesGetter?.array)
    const rows = computed(() => store[showFiles.value]||[])

    // const filter = ref('')
    const pagination = ref({
      page: 1,
      rowsPerPage: getItemsPerPage()
    }) // https://github.com/Intervention/image

    watch(() => $q.screen.name, () => pagination.value.rowsPerPage = getItemsPerPage())
    watch(files, val => storeFiles(selectedFiles.value = val))
    watch(showFiles, () => filesAction({}))

    const readFiles = (files: Blob[]) => filesMutation(files) // TagReadFiles: FileModule

    function filesAction(params: { refresh?: string[] }) {
      if (props.avatar) showFiles.value = 'avatars'
      selectedFiles.value = []; return crudAction({...params,
        url: `api/users/${auth.value?.id}`,// auth_id: auth.value?.id
        method: 'get', mutate: showFiles.value //.then((crud: string | any[]) => height(crud))
      }).then(() => emit('reload', props.post?'postFilePopUp':$route))
        .catch((e: unknown) => notifyAction({error: 'FilesAction', e}))

      // const height = (val: string | any[]) => {
      //   const gridMasonryClass = document.querySelector('.grid-masonry')
      //   if (gridMasonryClass) gridMasonryClass.style.height = val?.length*300+'px'
      // }
    } onMounted(() => filesAction({}))

    function storeFiles(SelectedFiles: string[]) {
      // if (SelectedFiles)
      api({
        url: `api/users/${auth.value?.id}`,
        method: 'put', data: {
          avatar: props.avatar,
          post: props.post, // Post Data
          pics: SelectedFiles,
          update: true }
      }).then(({ data }) => { // images.value = []
        filesAction({refresh: ['reloadApp']}) // Show Picture
         .then(() => !props.avatar || authAction()) // Show Avatar
        // if (props.avatar) authAction() // Show Avatar
        // if (props.avatar) emit('reloadAv') // Show Avatar
        notifyAction(data);
      }).catch(e => notifyAction({error: 'StoreFiles', e}))
      // else notifyAction({ message: 'File Do Not Exist' })
      // return selectedFiles.value
    } // TagAdd: FileModule

    function _readFiles(files: Blob[]) {

      for (let i = 0; i < files?.length; i++) {
        const reader = new FileReader()
        // readAsDataURL - readAsText - readAsBinaryString - readAsArrayBuffer
        reader.onload = (e: ProgressEvent<FileReader>) => {
          if (e.target?.result) selectedFiles.value.push(e.target.result)
          if (i+1 === files?.length) return storeFiles(selectedFiles.value)
        }; reader.readAsDataURL(files[i])
      } return selectedFiles.value
    } // TagUpload: FileModule

    function Delete(SelectedFiles: { forever: boolean }) {

      if (confirm('Are You Sure You Want '+(SelectedFiles?.forever?'To Delete Forever Pics':'To Delete Pics')) === true)
      return crudAction({
        url: `api/users/${auth.value?.id}`,
        method: 'delete', //data: {
          auth: auth?.value,
          forever: SelectedFiles?.forever,
          pics: SelectedFiles//}
      }).then(() => filesAction({refresh: ['reloadApp']}))
        .catch((e: unknown) => notifyAction({error: 'deleteSelectedFiles', e}))
    }

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
      baseURL,
      filter: ref(''),
      auth,
      ipDebug: computed(() => store.configGetter?.ipDebug),
      upload: ref(false),
      bool: ref(false),
      selectedFiles,
      showFiles,

      ios: capacitor()?.Capacitor?.getPlatform()==='ios', // -> 'web', 'ios' or 'android'
      modembIos: navigator.userAgent.match(/(modembIos)/), mobileApp,

      storeFiles,
      readFiles,
      files: ref(null),
      logUserAction,

      takePhoto: async () => storeFiles([await takePicture()]),

      // edit(selectedFiles) {
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
      //     //     /><!-- TagEdit: FileModule -->
      //     //   </template>
      //     // </q-input>`
      //   })
      // },// TODO TagEdit: FileModule

      restore (SelectedFiles: any[]) {
        api({
          url: 'api/users',
          method: 'post',
          data: {restorePics: SelectedFiles}
          // refresh: ['reloadApp']
          // auth_id: auth?auth.id:null,
          // pics: selectedFiles,'trashed_pics'
          // pic: true
        }).then(() => filesAction({refresh: ['reloadApp']}))
          .catch(e => notifyAction({error: 'restorePics', e}))
      }, // TagRestore: FileModule

      restoreAll() {
        if (confirm('Restore All Files')) api({
          url: 'api/users', method: 'post',
          data: {filesRestore: true}
        }).then(() => filesAction({refresh: ['reloadApp']}))
          .catch(e => notifyAction({error: 'restoreAll', e}))
          //.then(() =>  mSession(['reloadApp']))'trashed_pics'
      },

      deletePic(id: number) {
        if (confirm('Are You Sure You Want To Delete Pics') === true)
          api.delete(`api/users/${id}?deletePic=1`)
            .then(() => filesAction({refresh: ['reloadApp']}))
            .catch(e => notifyAction({error: 'deletePic', e}))
            // .then(() =>  mSession(['reloadApp']))showFiles.value
      }, // TagDeletePic: FileModule

      Delete,

      // (selectedFiles: { forever: unknown }) {
      //   selectedFiles.forever = 0
      //   if (confirm('Are You Sure You Want To Delete Pics') === true)
      //   cruDelete(selectedFiles)
      //     // .then(() =>  mSession(['reloadApp']))showFiles.value
      //     .then(() => filesAction({}))
      //     .catch(e => notifyAction({error: 'deleteSelectedFiles', e}))
      //   // cruDelete(selectedFiles).then(() => filesAction((showFiles.value === 'all_pics')?'all_pics':'my_pics'))
      // }, // TagDelete: FileModule

      delete_forever(selectedFiles: any) { // AddPasswordBeforeDeleteForever
        selectedFiles.forever = true; Delete(selectedFiles)
      }, // TagDeleteForever: FileModule: FileModule

      columns: <any> [
        { name: 'pic', align: 'center', label: ('picture'), field: 'pic', sortable: true },
        { name: 'post_title', align: 'center', label: ('post_title'), field: 'name', sortable: true },
        { name: 'address', align: 'center', label: ('address'), field: 'address', sortable: true },
        { name: 'city', align: 'center', label: ('city'), field: 'city', sortable: true },
        { name: 'end_date', align: 'center', label: ('expiry'), field: 'end_date', sortable: true },
        { name: 'edit', align: 'center', label: ('edit'), field: 'edit', sortable: false },
        { name: 'delete', align: 'center', label: ('delete'), field: 'delete', sortable: false }
      ], rows, pagination,

      cardContainerClass: computed(() => {
        return $q.screen.gt.xs
          ? 'grid-masonry grid-masonry--' + ($q.screen.gt.sm ? '3' : '2')
          : ''
      }),

      cardContainerStyle: computed(() => ({
        height: rows.value?.length*200+'px'
      })),

      rowsPerPageOptions: computed(() => {
        // return [0]
        return $q.screen.gt.xs
          ? $q.screen.gt.sm ? [ 3, 6, 9 ] : [ 3, 6 ]
          : [3]
      })
    }
  }
}
</script>
