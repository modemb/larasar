<template>
  <div class="q-pa-md q-gutter-sm">

    <q-dialog v-model="addPage"><!-- Add Update Pages PopUp ============-->
      <q-card class="my-card col-12" >
        <q-card-section class="bg-primary text-white">
          <q-btn color="primary" text-color="white" class="float-right" dense round icon="close" v-close-popup />
          <div class="text-h6">{{editPage?$t('update_page'):$t('add_page')}}</div>
        </q-card-section>

        <div class="q-pa-sm">
          <q-input outlined v-model="page_title" :label="$t('page_title')">
            <template v-slot:append>
              <q-toggle v-model="dense" v-if="desktop"/>
              <q-input outlined v-model="slug" :label="$t('custom_slug')" :disable="!dense" v-if="desktop"/>
              <q-input outlined v-model="description" :label="$t('description')" v-if="desktop"/>
              <q-input outlined v-model="icon" :label="$t('icon')" v-if="desktop"/>
              <locale-dropdown class="bg-primary" />
              <q-btn square outlined v-if="editPage"
                :color="Page.active?'secondary':'red'"
                :label="Page.active?'Active':'Draft'"
                @click.prevent="active(Page)"
              /><!-- TagActive: PageModule -->
              <q-btn square outlined
                v-if="editPage"
                class="q-ma-sm"
                icon="fas fa-edit"
                :loading="loader"
                @click.prevent="update(Page)"
              /><!-- TagUpdate: PageModule -->
              <q-btn square outlined
                class="q-ma-sm" v-else
                icon="fas fa-plus-square"
                :loading="loader"
                @click.prevent="add"
              /><!-- TagAdd: PageModule -->
            </template>
          </q-input><!-- TagAddTitle: PageModule -->
          <q-editor
            v-model="content"
            :dense="$q.screen.lt.md"
            :toolbar="[
              [
                {
                  label: $q.lang.editor.align,
                  icon: $q.iconSet.editor.align,
                  fixedLabel: true,
                  list: 'only-icons',
                  options: ['left', 'center', 'right', 'justify']
                },
                {
                  label: $q.lang.editor.align,
                  icon: $q.iconSet.editor.align,
                  fixedLabel: true,
                  options: ['left', 'center', 'right', 'justify']
                }
              ],
              ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
              ['token', 'hr', 'link', 'custom_btn'],
              ['print', 'fullscreen'],
              [
                {
                  label: $q.lang.editor.formatting,
                  icon: $q.iconSet.editor.formatting,
                  list: 'no-icons',
                  options: [
                    'p',
                    'h1',
                    'h2',
                    'h3',
                    'h4',
                    'h5',
                    'h6',
                    'code'
                  ]
                },
                {
                  label: $q.lang.editor.fontSize,
                  icon: $q.iconSet.editor.fontSize,
                  fixedLabel: true,
                  fixedIcon: true,
                  list: 'no-icons',
                  options: [
                    'size-1',
                    'size-2',
                    'size-3',
                    'size-4',
                    'size-5',
                    'size-6',
                    'size-7'
                  ]
                },
                {
                  label: $q.lang.editor.defaultFont,
                  icon: $q.iconSet.editor.font,
                  fixedIcon: true,
                  list: 'no-icons',
                  options: [
                    'default_font',
                    'arial',
                    'arial_black',
                    'comic_sans',
                    'courier_new',
                    'impact',
                    'lucida_grande',
                    'times_new_roman',
                    'verdana'
                  ]
                },
                'removeFormat'
              ],
              ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

              ['undo', 'redo'],
              ['viewsource']
            ]"
            :fonts="{
              arial: 'Arial',
              arial_black: 'Arial Black',
              comic_sans: 'Comic Sans MS',
              courier_new: 'Courier New',
              impact: 'Impact',
              lucida_grande: 'Lucida Grande',
              times_new_roman: 'Times New Roman',
              verdana: 'Verdana'
            }"
          />
        </div>
      </q-card>
    </q-dialog><!--================= Add Update Pages PopUp End ========-->

    <!--============================ Data Table ========================-->
    <q-table
      :style="'height:' + height + 'px'"
      ref="table"
      :title="$t('pages_list')"
      :rows="rows"
      :columns="columns"
      row-key="name"
      virtual-scroll
      :virtual-scroll-item-size="48"
      :rows-per-page-options="[0]"

      :loading="loading"
      :filter="filter"
      @request="onRequest"
      binary-state-sort
    >
    <!--
      :pagination="pagination"
    -->

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="page_title" :props="props">
            <!-- {{ props.row.page_title }}
            <q-popup-edit v-model="props.row.page_title" title="Update carbs" buttons persistent>
              <q-input type="text" v-model="props.row.page_title" dense autofocus hint="Use buttons to close" />
            </q-popup-edit> -->
            <q-btn color="primary" flat :label="props.row.page_title" :to="'/page/' + props.row.slug" />
          </q-td>
          <q-td key="description" :props="props">{{ props.row.description }}</q-td>
          <q-td key="icon" :props="props">{{ props.row.icon }}</q-td>
          <q-td key="active" :props="props">{{ props.row.active?'Active':'Draft' }}</q-td>
          <template v-if="pagesData">
            <q-td key="edit" :props="props">
              <q-btn icon="edit" rounded class="q-ma-md"  @click="edit(Page=props.row)"/>
            </q-td><!-- TagEdit: PageModule -->
            <q-td key="delete" :props="props">
              <q-btn icon="delete" rounded class="*q-mb-md" @click.prevent="Delete(props.row)"/>
            </q-td><!-- TagDelete: PageModule -->
          </template>
          <template v-else>
            <q-td key="edit" :props="props">
              <q-btn icon="restore" rounded class="q-ma-md" @click="restore(props.row)" />
            </q-td><!-- TagRestore: PageModule -->
            <q-td key="delete" :props="props">
              <q-btn icon="delete_forever" rounded class="*q-mb-md" @click.prevent="delete_forever(props.row)"/>
            </q-td><!-- TagDeleteForever: PageModule -->
          </template>
        </q-tr>
      </template>
      <template v-slot:top-right>
        <q-btn-toggle
          v-model="pagesData"
          push
          glossy class="q-ma-xs col-md-3"
          toggle-color="primary"
          :options="[
            {label: $t('pages'), value: 1},
            {label: $t('trashed'), value: 0}
          ]"
        /><!-- TagPeriod: PeriodModule -->
        <q-btn
          icon="add_circle_outline"
          rounded class="q-ma-md"
          :label="$t('add_page')"
          @click="addPage = true, editPage = false, post_title = icon = page_title = description = content = null"
        /><!-- TagAdd: PageModule -->
        <q-input borderless dense debounce="300" v-model="filter" :placeholder="$t('search')">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

    </q-table><!--================== Data Table End ====================-->
  </div>
</template>

<script>
import { useQuasar } from 'quasar'
import { ref, watch, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { i18n, url, api, crudAction, notifyAction } from 'boot/axios'
import LocaleDropdown from '../components/LocaleDropdown'

export default {
  components: {
    LocaleDropdown
  },
  setup () {
    const $t = i18n?.global?.t
    const $q = useQuasar()
    const $store = useStore()
    const loader = ref(false)
    const addPage = ref(false)
    const editPage = ref(false)
    const loading = ref(false)
    const rows = ref([])
    const slug = ref(null)
    const icon = ref(null)
    const Page = ref(null)
    const page_title = ref(null)
    const description = ref(null)
    const content = ref(null)
    const pagesData = ref(1)

    const locale = computed(() => $store.getters['config/localeGetter'])

    onMounted (() => crud({e: 'onMountedPages'}))

    function edit (page) {

      watch(rows, val => val.forEach(page => {
        if ((page.slug===Page.value.slug)&&(page.locale!==Page.value.locale))
          return edit(Page.value = page)
      })); editPage.value = addPage.value = true; loader.value = false

      locale.value = page.locale
      icon.value = page.icon
      page_title.value = page.page_title
      slug.value = page.slug
      description.value = page.description
      content.value = page.content
    } // TagEdit: PageModule

    function crud (data) {
      crudAction({
        url: 'api/pages/1',
        method: 'get',
        pages: pagesData.value,
        locale: locale.value,
      }).then(crud => rows.value = crud)
        .catch(e => notifyAction({error: data.e, e}))
    } watch([locale, pagesData], () => crud({e: 'localePage'}))

    function Delete (page) {
      if (confirm('Are You Sure You Want To Delete Page ' + page.page_title) === true) {
        crudAction({
          message: page.forever ? 'Page Deleted Forever' : 'Page Deleted Successfully',
          url: 'api/pages/1',
          method: 'delete',
          locale: locale.value,
          slug: page.slug,
          pages: page.forever ? 0 : 1,
          forever: page.forever
        }).then(crud => rows.value = crud)
          .catch(e => notifyAction({error: 'deletePage', e}))
      }
    } // TagDelete: PageModule

    return {
      desktop: $q.platform.is.desktop,
      height: screen.height / 1.4,
      pagesData,
      icon,
      // icon_data,
      Page,
      page_title,
      // page_title_data,
      slug,
      // slug_data,
      description,
      // description_data,
      content,
      // content: '<pre>Check out the two different types of dropdowns' +
      //   ' in each of the "Align" buttons.</pre> ',
      dense: ref(false),
      filter: ref(''),

      loader,
      addPage,
      editPage,
      loading,

      // content_data,

      url,

      add () {
        crudAction({
          message: 'Page Created Successfully',
          url: 'api/pages',
          method: 'post',
          locale: locale.value,
          icon: icon.value,
          page_title: page_title.value,
          description: description.value,
          content: content.value,
          pages: 1
        }).then(crud => rows.value = crud)
          .catch(e => notifyAction({error: 'addPage', e}))
        pagesData.value = 1
        icon.value = page_title.value = description.value = content.value = null
      }, // TagAddTitle: PageModule
      edit,
      update (page) {
        loader.value = true
        crudAction({
          message: 'Page Updated Successfully',
          url: `api/pages/${page.id}`,
          method: 'put',
          locale: locale.value,
          page_title: page_title.value,
          slug: slug.value,
          description: description.value,
          icon: icon.value,
          content: content.value,
          pages: 1
        }).then(crud => {rows.value = crud; loader.value = false })
          .catch(e => notifyAction({error: 'updatePage', e}))
      }, // TagUpdate: PageModule
      async active (page) {
        loader.value = true
        const { data } = await api.put(`api/pages/${page.slug}`, {
          message: page.active ? 'Page Deactivated Successfully' : 'Page Activated Successfully',
          active: 1,
          activePages: page.active
        }); Page.value = data.page
        if (data.success) {
          loader.value = false
          notifyAction({success: data.success})
          crud({e: 'mountedPages'})
        }
      }, // TagActive: PageModule
      restore (page) {
        loader.value = true
        crudAction({
          message: 'Page Restored Successfully',
          url: 'api/pages',
          method: 'POST',
          slug: page.slug,
          locale: locale.value,
          pages: 0
        }).then(crud => {rows.value = crud; loader.value = false })
          .catch(e => notifyAction({error: 'restorePage', e}))
      }, // TagRestore: PageModule
      delete_forever (page) {
        Delete({...page, ...{forever: 1}})
        // AddPasswordBeforeDeleteForever
      }, // TagDeleteForever: PageModule

      pagination: {
        sortBy: 'asc',
        descending: false,
        page: 1,
        rowsPerPage: 0,
        rowsNumber: 10
      },
      columns: [
        { name: 'page_title', align: 'center', label: $t('page_title'), field: 'page_title', sortable: true },
        { name: 'description', align: 'center', label: $t('description'), field: 'description', sortable: true },
        { name: 'icon', align: 'center', label: $t('icon'), field: 'icon', sortable: true },
        { name: 'active', align: 'center', label: $t('active'), field: 'active', sortable: true },
        { name: 'edit', align: 'center', label: $t('edit/restore'), field: 'edit', sortable: false },
        { name: 'delete', align: 'center', label: $t('delete/foreve'), field: 'delete', sortable: false }
      ], rows
    }
  }
}
</script>
