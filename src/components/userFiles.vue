<template>
  <q-layout view="lHh lpr lFf" container style="height: 800px" class="shadow-2 rounded-borders">

    <q-dialog v-model="viewVideo"><!--============ Edit Post PopUp ===========-->
      <q-card class="my-card col-12" style="width:1250px">
        <q-card-section class="q-ma-md">
          <q-btn class="float-right q-ml-xs" dense round icon="close" v-close-popup />
          <q-input filled clearable type="file" accept="video/*"
            @update:model-value="(val: any) => readFiles(val)"
          >

            <a ref="downloadLink" style="display:none;">
              <q-btn dense flat color="grey" icon="fas fa-download"/>
            </a><!-- downloadLink label="Download Recording" -->

            <q-btn dense flat color="negative"
              icon="fas fa-video" v-if="isRecording"
              @click.prevent="stopRecording"
            /><!-- stopRecording -->
            <q-btn dense flat color="grey"
              icon="fas fa-video" v-else
              @click.prevent="startRecording"
            /><!-- startRecording -->

            <!-- <q-btn dense color="primary" @click="uploadVideo" label="Upload Video"/> -->

          </q-input><!-- TagTakeVideo: UserUpdate  -->

          <h6>Record and Save MediaStream</h6>
          <video autoplay controls height="500" ref="preview">
            <source :src="file" type="video/mp4" v-for="(file, i) in selectedFiles" :key="i">
            <!-- <source :src="downloadLink" type="video/webm" /> -->
            •	src: Specifies the URL of the video file.
            •	controls: Adds video controls, like play, pause, and volume.
            •	autoplay: The video will start playing as soon as it is ready.
            •	loop: The video will start over again, every time it is finished.
            •	muted: Mutes the audio of the video by default.
            •	poster: Specifies an image to be shown while the video is downloading, or until the user hits the play button.
            •	preload: Specifies if and how the author thinks the video should be loaded when the page loads. Can be auto, metadata, or none.
            •	width and height: Specifies the width and height of the video player.
          </video>
        </q-card-section>
      </q-card><!-- TagVideoFileBool: FilesModule -->
    </q-dialog>

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

          <q-input filled multiple dark type="file"
            hint="Native file (multiple)" v-else
            @update:model-value="(val: any) => readFiles(val)"
          /><!-- https://quasar.dev/vue-components/input#example--input-of-file-type -->

        </div><!-- https://quasar.dev/vue-components/uploader#introduction -->

        <div class="col-xl-8">
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

          <q-btn class="q-ma-xs col-md-2" icon="fas fa-cloud-upload-alt"
            @click.prevent="upload = !upload"  v-if="ipDebug"
          /><!-- TagUpload: FileModule !mobileApp-->

          <q-btn icon="fas fa-video"
            :class="(videoFileBool(selectedFiles)?'bg-orange':'')+' q-ma-xs col-md-2'"
            @click="viewVideo = true" v-if="ipDebug"
          /><!-- TagVideoFileBool: FilesModule -->
          <q-btn icon="fas fa-file-import" v-if="post"
            :class="(selectedFiles?.length?'bg-orange':'')+' q-ma-xs col-md-2'"
            @click="storeFiles(selectedFiles)"
          /><!-- TagAdd: FileModule -->
          <q-btn icon="edit" class="q-ma-xs col-md-2"
            v-if="ipDebug&&showFiles==='all_pics'"
            @click="restoreAll" label="restore all"
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

          <q-toggle v-if="(ipDebug&&(showFiles==='trashed_pics')||(showFiles==='all_trashed_pics'))"
            :icon="'fas fa-user'+(bool?'s':'')"
            :val="[true]" size="xl" v-model="bool"
          />
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

          <template v-slot:loading>
            <div class="row justify-center q-my-md">
              <q-spinner-dots color="primary" size="40px" />
            </div>
          </template>

          <template v-slot:item="props">
            <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
              <q-card class="my-card">


                <q-video :src="baseURL+'/'+props.row.file" :ratio="16/9"
                  v-if="videoFileBool(props.row.file)"
                /><!-- TagVideoFileBool: FilesModule -->
                <q-img :src="props.row?.avatar?.includes('https') ? props.row.avatar :
                                    baseURL+'/'+(props.row.file||props.row.avatar)" v-else />
                <div v-html="props.row.name" v-if="props.row.name" />
                <q-checkbox v-model="selectedFiles"
                  :val="props.row.file"
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

<script lang="ts" setup>
import { useQuasar } from 'quasar'
import { ref, computed, watch, onMounted } from 'vue'
import { api, i18n, baseURL, mobileApp, logUserAction, authAction, filesMutation, included } from 'boot/axios'
import { takePicture, videoFileBool } from './Functions'
import { useCrudStore } from 'stores/crud'



defineOptions({
  name: 'FilesPage'
})

const props = defineProps(['height', 'avatar', 'post'])
// const emit = defineEmits(['reload', 'reloadAv'])

/**
 * Tags: TagVideoFileBool - selectModule
 *
 * @to
 */
// export default {
  // props: ['height', 'avatar', 'post'],
  // setup (props, { emit }) {
    const $t = i18n.global.t
    const $q = useQuasar()
    const $store = useCrudStore()
    // const $route = useRoute()
    const { crudAction, notifyAction } = $store
    const selectedFiles: any = ref([])
    const showFiles = ref('my_pics')
    const upload = ref(false)
    const bool = ref(false)
    const filter = ref('')
    const columns = <any> ref([
      { name: 'pic', align: 'center', label: ('picture'), field: 'pic', sortable: true },
      { name: 'post_title', align: 'center', label: ('post_title'), field: 'name', sortable: true },
      { name: 'address', align: 'center', label: ('address'), field: 'address', sortable: true },
      { name: 'city', align: 'center', label: ('city'), field: 'city', sortable: true },
      { name: 'end_date', align: 'center', label: ('expiry'), field: 'end_date', sortable: true },
      { name: 'edit', align: 'center', label: ('edit'), field: 'edit', sortable: false },
      { name: 'delete', align: 'center', label: ('delete'), field: 'delete', sortable: false }
    ]); const Items = 0

    const ipDebug = computed(() => $store.configGetter?.ipDebug)
    const rows = computed(() => $store[showFiles.value]||[])
    const files = computed(() => $store.filesGetter?.array)
    const auth = computed(() => $store.authGetter)
    const cardContainerClass = computed(() => {
      return $q.screen.gt.xs
        ? 'grid-masonry grid-masonry--' + ($q.screen.gt.sm ? '3' : '2')
        : ''
    }) // Card Container Class
    const rowsPerPageOptions = computed(() => {
      // return [0]
      return $q.screen.gt.xs
        ? $q.screen.gt.sm ? [ 3, 6, 9 ] : [ 3, 6 ]
        : [3]
    }) // Rows Per Page Options
    const cardContainerStyle = computed(() => ({
      height: rows.value?.length*200+'px'
    })) // Card Container Style

    const pagination = ref({
      page: 1,
      rowsPerPage: getItemsPerPage()
    }) // https://github.com/Intervention/image

    watch(() => $q.screen.name, () => pagination.value.rowsPerPage = getItemsPerPage())
    watch(files, val => storeFiles(selectedFiles.value = val))
    watch(showFiles, () => filesAction({}))

    const readFiles = (files: Blob[]) => filesMutation(files) // TagReadFiles: FileModule
    const takePhoto = async () => storeFiles([await takePicture()])

    function filesAction(params: { refresh?: string[] }) {
      if (props.avatar) showFiles.value = 'avatars'
      selectedFiles.value = []; return crudAction({...params,
        url: `api/users/${auth.value?.id}`,// auth_id: auth.value?.id
        method: 'get', mutate: showFiles.value //.then((crud: string | any[]) => height(crud))
      })//.then(() => emit('reload', props.post?'postFilePopUp':$route))
        .then(() => crudAction({ reload: Date.now(), mutate: 'reloadGetter' })) // , refresh: ['reloadApp']
        .catch((e: unknown) => notifyAction({error: 'FilesAction', e}))

    } onMounted(() => filesAction({}))

    function storeFiles(SelectedFiles: string[]) { //return console.log('checkBlobType', checkBlobType(SelectedFiles?.[0]))
      let bool = props.post !== undefined || props.avatar !== undefined
      if (SelectedFiles?.length) bool = false // Assign Existing Pictures
      else return notifyAction({ message: 'No Picture Selected' }); api({
        url: `api/users/${auth.value?.id}`,
        method: 'put', data: {
          // avatar: props.avatar,
          post: bool?false:props.post, // Post Data
          pics: bool?false:SelectedFiles,
          update: true }
      }).then(({ data }) => { // images.value = []
        filesAction({refresh: ['reloadApp']}) // Show Picture
        //  .then(() => !props.avatar || authAction()) // Show Avatar
        if (props.avatar) authAction() // Show Avatar
        // if (props.avatar) emit('reloadAv') // Show Avatar
        notifyAction(data);
      }).catch(e => notifyAction({error: 'StoreFiles', e}))
    } // TagAdd: FileModule

    // ===========================================================
    const isRecording = ref(false)
    const preview = ref<any>(null)
    const downloadLink = ref<any>(null)
    const viewVideo = ref(false)
    let mediaRecorder: MediaRecorder | any = null
    let recordedChunks: BlobPart[] | undefined = []

    const startRecording = () => navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream: MediaStream) => {
        // preview.value = document.querySelector('video')
        preview.value.srcObject = stream

        mediaRecorder = new MediaRecorder(stream)
        mediaRecorder.ondataavailable = (event: { data: BlobPart; }) => {
          if (event.data.size > 0) recordedChunks.push(event.data)
          console.log('size', event.data.size, 'data', event.data)
          checkBlobType(event)
        } // Start Recording
        mediaRecorder.onstop = () => {
          const blob = new Blob(recordedChunks, { type: 'video/mp4' })
          downloadLink.value.href = URL.createObjectURL(blob)
          downloadLink.value.download = 'recording.mp4'
          downloadLink.value.style.display = 'block'
          downloadLink.value.style.margin = '8px 0'
          readFiles([blob])
        } // webm - mp4 - mov
        mediaRecorder.start()
        isRecording.value = true
      }).catch((e) => notifyAction({error: 'startRecording', e}))

    const stopRecording = () => {
      const tracks = preview.value.srcObject.getTracks()
      tracks.forEach((track: { stop: () => unknown }) => track.stop())
      mediaRecorder.stop()
      isRecording.value = false
    }

    // const uploadVideo = async () => {

    //   if (!files.value) return notifyAction({message: 'Please select a video file.'})

    //   storeFiles(files.value)

    //   // const avatar = files.value;
    //   // return api.put('api/users/1', { avatar, update: true })
    //   //   .then(({ data }) => notifyAction(data))
    //   //   .catch(e => notifyAction({ error: 'uploadVideo', e }))
    // }
    // ===========================================================

    function Delete(SelectedFiles: { forever: boolean }) {

      if (!selectedFiles.value?.length) return notifyAction({ message: 'No Picture Selected' })
      if (confirm($t('Are You Sure You Want '+(SelectedFiles?.forever?'To Delete Forever Pics':'To Delete Pics')))) api({
        url: `api/users/${auth.value?.id}`,
        method: 'delete', data: {
          auth: auth?.value,
          forever: SelectedFiles?.forever,
          pics: SelectedFiles }
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

    function restore (SelectedFiles: any[]) {
      if (SelectedFiles?.length) api({
        url: 'api/users',
        method: 'post',
        data: {restorePics: SelectedFiles}
        // refresh: ['reloadApp']
        // auth_id: auth?auth.id:null,
        // pics: selectedFiles,'trashed_pics'
        // pic: true
      }).then(() => filesAction({refresh: ['reloadApp']}))
        .catch(e => notifyAction({error: 'restorePics', e}))
      else notifyAction({ message: 'No Picture Selected' })
    } // TagRestore: FileModule

    function restoreAll() {
      if (confirm('Restore All Files')) api({
        url: 'api/users', method: 'post',
        data: {filesRestore: true}
      }).then(() => filesAction({refresh: ['reloadApp']}))
        .catch(e => notifyAction({error: 'restoreAll', e}))
        //.then(() =>  mSession(['reloadApp']))'trashed_pics'
    }

    function deletePic(id: number) {
      if (confirm('Are You Sure You Want To Delete Pics') === true)
        api.delete(`api/users/${id}?deletePic=1`)
          .then(() => filesAction({refresh: ['reloadApp']}))
          .catch(e => notifyAction({error: 'deletePic', e}))
          // .then(() =>  mSession(['reloadApp']))showFiles.value
    } // TagDeletePic: FileModule

    function delete_forever(SelectedFiles: any) { // AddPasswordBeforeDeleteForever
      SelectedFiles.forever = true; Delete(SelectedFiles)
    } // TagDeleteForever: FileModule: FileModule

    // return {
    //   baseURL,auth,
    //   showFiles,
    //   selectedFiles,

    //   storeFiles,
    //   readFiles,
    //   logUserAction,


    //   // edit(selectedFiles) {
    //   //   selectedFiles.forEach(selectedFile => {
    //   //     // let test = document.getElementsByClassName(selectedFile)//.innerHTML =1
    //   //     let test = document.querySelector(`.${selectedFile}`)//.innerHTML = 1
    //   //     // console.log('test', test)
    //   //     // `<q-input color="teal" outlined v-model="text" label="Label" v-if="selectedFiles">
    //   //     //   <template v-slot:append>
    //   //     //     <q-btn class="*glossy"
    //   //     //       flat :loading="loader"
    //   //     //       icon="fas fa-edit"
    //   //     //       @click.prevent="edit(text)"
    //   //     //     /><!-- TagEdit: FileModule -->
    //   //     //   </template>
    //   //     // </q-input>`
    //   //   })
    //   // },// TODO TagEdit: FileModule

    //   Delete,

    //   // (selectedFiles: { forever: unknown }) {
    //   //   selectedFiles.forever = 0
    //   //   if (confirm('Are You Sure You Want To Delete Pics') === true)
    //   //   cruDelete(selectedFiles)
    //   //     // .then(() =>  mSession(['reloadApp']))showFiles.value
    //   //     .then(() => filesAction({}))
    //   //     .catch(e => notifyAction({error: 'deleteSelectedFiles', e}))
    //   //   // cruDelete(selectedFiles).then(() => filesAction((showFiles.value === 'all_pics')?'all_pics':'my_pics'))
    //   // }, // TagDelete: FileModule


    //   columns: <any> [
    //     { name: 'pic', align: 'center', label: ('picture'), field: 'pic', sortable: true },
    //     { name: 'post_title', align: 'center', label: ('post_title'), field: 'name', sortable: true },
    //     { name: 'address', align: 'center', label: ('address'), field: 'address', sortable: true },
    //     { name: 'city', align: 'center', label: ('city'), field: 'city', sortable: true },
    //     { name: 'end_date', align: 'center', label: ('expiry'), field: 'end_date', sortable: true },
    //     { name: 'edit', align: 'center', label: ('edit'), field: 'edit', sortable: false },
    //     { name: 'delete', align: 'center', label: ('delete'), field: 'delete', sortable: false }
    //   ], rows, pagination,

    //   cardContainerClass: computed(() => {
    //     return $q.screen.gt.xs
    //       ? 'grid-masonry grid-masonry--' + ($q.screen.gt.sm ? '3' : '2')
    //       : ''
    //   }),

    //   cardContainerStyle: computed(() => ({
    //     height: rows.value?.length*200+'px'
    //   })),

    //   rowsPerPageOptions: computed(() => {
    //     // return [0]
    //     return $q.screen.gt.xs
    //       ? $q.screen.gt.sm ? [ 3, 6, 9 ] : [ 3, 6 ]
    //       : [3]
    //   })
    // }
  // }
// }
</script>
