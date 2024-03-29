<template>
  <q-dialog v-model="popCategory">
    <q-card class="my-card text-black" style="width:900px">
      <q-input class="q-ma-xs" clearable rounded outlined v-model="categoryName" :label="$t('update_category_name')">
        <template v-slot:append>
          <q-input clearable square outlined v-model="description" :label="$t('update_description')"/>
          <q-input clearable square outlined v-model="icon" :label="$t('update_icon')"/>
          <locale-dropdown class="bg-primary" />
          <q-btn class="glossy"
            dense :loading="loader"
            icon="fas fa-edit"
            @click.prevent="updateCategory(getCategory.id)"
          /><!-- TagUpdateCategory: CategoryModule -->
          <q-btn class="float-right q-ml-xs" dense round icon="close" v-close-popup />
        </template>
      </q-input><!--============== Category ==========-->
      <q-separator />
      <div dense v-if="getCategory.subcategories">
        <div v-for="(subcategory, key) in getCategory.subcategories" :key="key">
          <q-input class="q-ma-xs" clearable
            v-for="(locale, key) in subcategory.locales" :key="key"
            rounded outlined v-model="subcategoryName"
            :hint="locale.subcategoryName"
            :label="$t('update_subcategory_name')"
          >
            <template v-slot:append>
              <q-btn class="glossy"
                dense :loading="loader"
                icon="fas fa-edit"
                @click.prevent="updateSubcategory(subcategory.category_id, subcategory.id)"
              /><!-- TagUpdateSubcategory: SubcategoryModule -->
            </template>
          </q-input>
        </div>
      </div><!--============ Subcategories ======-->
    </q-card>
  </q-dialog><!-- TagEditCategory: CategoryModule -->
  <q-dialog v-model="view"><!--============ Edit Post PopUp ===========-->
    <q-card class="my-card  col-12" style="width:1000px">
        <post :postData="postData" />
    </q-card><!-- TagEditPost: PostModule -->
  </q-dialog><!--========================== Edit Post PopUp End =======-->
  <div class="q-pa-md"><!--================ Categories ================-->
    <q-table
      hide-header

      :style="'height:' + height + 'px'"
      :title="title"
      row-key="name"

      :card-container-class="cardContainerClass"
      :grid="show === 'categories'"
      :rows="rows"
      :columns="columns"
      :filter="filter"
      :rows-per-page-options="[0/*rowsPerPageOptions*/]"

      virtual-scroll
      :virtual-scroll-item-size="48"
      ref="table"
    >
      <!--
      :pagination.sync="pagination"
      -->
      <template v-slot:top-right>
        <q-input clearable borderless dense debounce="300" v-model="filter" :placeholder="$t('search')" v-if="show === 'category'">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input><!-- TagSearch: https://quasar.dev/vue-components/table#Example--Using-grid-prop -->
        <q-input clearable rounded outlined v-model="categoryName" :label="$t('add_category')" v-if="role.admins">
          <template v-slot:append>
            <q-input clearable square outlined v-model="description" :label="$t('add_description')"/>
            <q-toggle v-model="showAll" label="All" />
            <q-input clearable square outlined v-model="icon" :label="$t('add_icon')"/>
            <q-btn class="glossy q-ml-md"
              dense round :loading="loader"
              icon="fas fa-plus-circle"
              @click.prevent="addCategory"
              :error="category_data ? true : false"
              :error-message='category_data'
            />
          </template>
        </q-input><!-- TagAddCategory: CategoryModule -->
      </template>

      <template v-slot:item="props" v-if="show === 'categories'"><!-- CategoriesList ========================================-->
        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
          <q-card class="q-pa-xs">
            <q-card-section class="text-center">
              <q-btn class="q-ma-xs" flat :icon="props.row.icon"
                :label="props.row.locales?.categoryName||$t('Translation Not Available Yet')"
                :to="'/category/' + props.row.id"
              /><!-- TagCategoryName: CategoryModule -->
              <span v-if="role.admins">
                <q-btn class="glossy"
                  dense :loading="loader"
                  icon="fas fa-edit"
                  @click.prevent="editCategory(props.row)"
                /><!-- TagEditCategory: CategoryModule -->
                <q-btn class="glossy"
                  dense :loading="loader"
                  icon="fas fa-trash-alt"
                  @click.prevent="deleteCategory(props.row.id)"
                /><!-- TagDeleteCategory: CategoryModule -->
              </span>
              <div class="row" v-if="role.admins">
                <div class="col-md-12">
                  <q-input rounded outlined
                    v-model="subcategoryName"
                    :label="$t('add_subcategory')" clearable
                    :error="subcategory_data ? true : false"
                    :error-message='subcategory_data'
                  >
                    <template v-slot:append>
                      <div v-if="props.row.id">
                        <q-btn class="glossy"
                          dense round :loading="loader"
                          icon="fas fa-plus-circle"
                          @click.prevent="addSubcategory(props.row.id)"
                        />
                      </div>
                    </template>
                  </q-input>
                </div><!-- TagAddSubcategory: SubcategoryModule -->
              </div>
            </q-card-section>
            <q-separator />
            <q-list dense>
              <div v-for="(subcategory, key) in subcategoriesSorted(props.row.subcategories)" :key="key">
                <q-item clickable tag="a" :to="'/subcategory/' + subcategory.id">
                  <q-item-section>
                    <q-item-label v-for="(locale, key) in subcategoryLangs(subcategory)" :key="key">
                      {{localeSubcategoryName(locale)||$t('Translation Not Available Yet')}} <!-- TagLocaleSubcategoryName: SubcategoryModule -->
                    </q-item-label><!-- TagSubcategoryLangs: SubcategoryModule -->
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label caption>{{subcategory.PostsNumber}}</q-item-label>
                  </q-item-section><!-- TagSubcategoryPostsNumber: SubcategoryModule -->
                  <q-btn class="glossy q-ml-md"
                    dense :loading="loader"
                    v-if="role.admins"
                    icon="fas fa-trash-alt"
                    @click.prevent="deleteSubcategory(subcategory.id)"
                  /><!-- TagDeleteSubcategory: SubcategoryModule -->
                </q-item>
              </div><!-- TagSubcategoriesSorted: SubcategoryModule -->
            </q-list><!--============ Subcategories ======-->
          </q-card>
        </div><!-- TagCategories: CategoriesModule -->
      </template><!--================================================ CategoriesList End ====================================-->

      <template v-slot:body="props" v-else><!-- ===================== CategoryList - SubcategoryList ======================= -->
        <div class="q-pa-md q-gutter-md">
          <q-list bordered class="rounded-borders" style="max-width: 1600px">
            <q-item>
              <q-item-section style="max-width: 150px; max-height: 150px; cursor: pointer;" @click="viewPost(props.row)">
                <q-img :src="baseURL+'/'+pic(props.row)" v-if="pic(props.row)"/>
                <q-icon name="fas fa-plus-circle" color="black" size="150px" v-else/>
              </q-item-section><!-- TagTablePic: PicModule -->

              <q-item-section>
                <q-item-label lines="1">
                  <span class="text-weight-medium">{{props.row.city}}</span>
                  <span class="text-grey-8"> {{props.row.postal_code}}</span>
                </q-item-label>
                <q-item-label lines="1" class="q-mt-xs text-body2 text-weight-bold text-primary text-uppercase">
                  <!-- <span class="cursor-pointer">Open in GitHub</span> -->
                  <q-btn flat :label="props.row.post_title" :to="'/post/' + props.row.id" />
                </q-item-label>
                <q-item-label caption lines="1">
                  <span class="text-grey-8 q-pa-md" v-if="props.row.price>0">
                    {{Number(props.row.price).toLocaleString(locale,
                      { style: 'currency', currency: props.row.currency_code||'USD' })}}
                  </span>
                </q-item-label>
                <q-item-label caption lines="1">
                  <!-- {{$t('created_at')}}: {{props.row.created_at}} -->
                  <small class="timestamp timeago q-pa-md" v-if="ipDebug">
                    <!-- <timeago :datetime="props.row.start_date" :auto-update="60" /> -->
                    {{timeago(props.row.start_date)}}
                  </small>
                </q-item-label>
              </q-item-section>

              <q-item-section side>
                <div class="text-grey-8 q-gutter-xs">
                  <!-- <q-btn class="gt-xs" size="12px"
                    flat dense round icon="fas fa-heart"
                    @click.prevent="favorite(props.row.id)"
                  /> -->

                  <!-- <q-btn class="*gt-xs" size="12px" :loading="loader"
                    flat dense round @click.prevent="favorite(props.row)"
                  ><q-icon name="fas fa-heart" style="font-size: 2.4em;"
                      :class="wish(props.row)?'text-red':''"
                    />
                  </q-btn>TagFavorite: FavoriteModule -->

                  <wish :post="props.row" v-on:favorite="wish"
                  /><!-- TagFavorite: FavoriteModule -->
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </template><!-- =============================================== CategoryList - SubcategoryList End ======================= -->

    </q-table><!-- TagCategoryTable: CategoryModule -->
  </div>
</template>

<script>
import { ref, watch, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { useCrudStore } from 'stores/crud'
import { useCategoriesStore } from 'stores/categories'
import { i18n, baseURL, timeago, ipDebug } from 'boot/axios'
import LocaleDropdown from './LocaleDropdown.vue'
import Wish from './UserWish.vue'
import Post from './UserPost.vue'

/**
 * Tags: CategoryModule - LocationModule - TagSubcategoriesSorted - CategoriesList - CategoryList
 *       FavoriteModule - TagLocaleSubcategoryName - SearchModule - TagTablePic - TagSubcategoryLangs
 *       TagSubcategoryPostsNumber
 * @from CategoryController
 */
export default {
  props: ['height'],
  components: {
    LocaleDropdown,
    Wish,
    Post
  },
  setup () {
    const $t = i18n.global.t
    const $q = useQuasar()
    const $store = useStore()
    const store = useCrudStore()
    const $route = useRoute()
    const loader = ref(false)
    const popCategory = ref(false)
    const categoryName = ref(null)
    const category_data = ref(null)
    const description = ref(null)
    const icon = ref(null)
    const subcategoryName = ref(null)
    const subcategory_data = ref(null)
    const subcategories = ref([])
    const getCategory = ref([])
    const postData = ref({})
    const view = ref(false)
    // ================================ \\
    const category_id = ref(false)
    const show = ref(false)
    const showAll = ref(false)
    const title = ref('')
    const Crud = ref([])
    const getters = ref('categoriesGetter')
    const pagination = ref({
      page: 1,
      rowsPerPage: 3, // getItemsPerPage(),
      rowsNumber: 0
    })

    const Items = 0
    const { crudAction, notifyAction } = store
    const { categoriesAction } = useCategoriesStore()

    const rows = computed(() => (store[getters.value]||Crud.value)?.sort(
      (a, b) => a?.locales?.categoryName?.localeCompare(b?.locales?.categoryName)
    )) // ^^^ Sort Categories
    const location = computed(() => $store.getters['users/locationGetter'])
    const distance = computed(() => $store.getters['users/distanceGetter'])
    const locale = computed(() => $store.getters['config/localeGetter'])
    const role = computed(() => $store.getters['users/rolesGetter'])
    const auth = computed(() => $store.getters['users/authGetter'])
    const reload = computed(() => store['reload']?.reload)

    onMounted(() => { // https://next.router.vuejs.org/api/#onbeforerouteleave
      if ($route.name === 'index') categories()
      else categoryPosts($route)//; console.log('undefined', store[undefined])
    }) // console.log('$router', $router)

    watch($route, val => categoryPosts(val))
    watch(() => $q.screen.name, () => pagination.value.rowsPerPage = getItemsPerPage())
    watch([location, locale, distance, reload], () => {
      categoriesAction(); categoryPosts($route)
    })// Reload Updated Change

    function getItemsPerPage() {
      // const { screen } = $q
      // if (screen.lt.sm) {
      //   return 3
      // }
      // if (screen.lt.md) {
      //   return 6
      // }
      // return 9
      return Items
    }

    async function categories() {

      show.value = 'categories'; title.value = $t('categories')

      const gridMasonryClass = document.querySelector('.grid-masonry')
      const hight = store[getters.value]

      if (!hight?.length) categoriesAction()
      if (gridMasonryClass) gridMasonryClass.style.height = hight?.length*50+'px'

    } // TagCategoriesAction: CategoriesModule

    function categoryPosts(to) {

      if (to.name === 'index') return;  show.value = 'category'
      if (to.name === 'public.search.posts') { // TagSearch: SearchModule

        title.value = $t('search_result')
        getters.value = to.params.posts

        crudAction({ ...{ search_posts: to.params.posts }, ...to.query, ...{
          url: 'api/categories/searchPosts',
          method: 'get', mutate: to.params.posts
        }}).then(crud => Crud.value = crud) // Get Search Result
           .catch(e => notifyAction({error: 'SearchPostsAction', e}))

      } else if (to.name === 'public.category.id' || to.name === 'public.subcategory.id') {

        const bool = to.path.includes('subcategory'); const loc = location.value;
        const authUser = { ...distance.value, ...{ loc, locale: locale.value, auth_id: auth.value?.id }}
        const data = bool ? { subcategory_id: to.params.id } : { category_id: to.params.id }

        getters.value = to.path // title.value = bool ? rows.value?.[0]?.subcategoryName : rows.value?.[0]?.categoryName

        if (!rows.value?.length) crudAction({ ...data, ...authUser, ...{
          url: 'api/categories/SubCategory',
          method: 'get', mutate: to.path // Get Category Subcategory Posts
        }}).then(crud => Crud.value = crud.filter(c => title.value = c?.subcategoryName||c?.categoryName))
           .catch(e => notifyAction({error: 'SubCategoryPostsAction', e}))
        else title.value = rows.value?.[0]?.subcategoryName||rows.value?.[0]?.categoryName

      } // Get Category Subcategory Posts Data

    } // TagCategory: CategoryModule - SubcategoryModule

    function editCategory(category) {

      popCategory.value = true
      category_id.value = category.id
      categoryName.value = category?.locales?.categoryName || 'categoryName'
      subcategories.value = category?.subcategories
      description.value = category?.locales?.description || 'description'
      icon.value = category.icon
      getCategory.value = category

    } // TagEditCategory: CategoryModule,

    return {
      ipDebug,
      auth,
      loader,
      popCategory,
      categoryName,
      category_data,
      description,
      // description_data,
      icon,
      // icon_data,
      subcategoryName,
      subcategory_data,
      filter: ref(''),
      subcategories,
      getCategory,
      postData,
      view,
      // ================================ \\
      baseURL,
      timeago,
      category_id,
      show,
      title,
      role,
      showAll,
      locale,

      cardContainerClass: computed(() => {
        if ($q.screen.gt.xs) {
          return 'grid-masonry grid-masonry--' + ($q.screen.gt.sm ? '3' : '2')
        } return void 0
      }),

      rowsPerPageOptions: computed(() => {
        return [0]
        return $q.screen.gt.xs
          // ? $q.screen.gt.sm ? [ 3, 6, 9 ] : [ 3, 6 ]
          // : [3]
          ? $q.screen.gt.sm ? [ Items, 6, 9 ] : [ Items, 6 ]
          : [Items]
      }),

      wish: () => categoryPosts($route), // TagFavorite: FavoriteModule
      pic: post => post?.pics?.[0]?.pic, // TagTablePic: PicModule

      viewPost(post) {
        postData.value = post; view.value = true
      },

      categoryPosts, // TagCategory: CategoryModule - SubcategoryModule
      subcategoryLangs: subcategory => subcategory?.locales, // TagSubcategoryLangs: SubcategoryModule
      localeSubcategoryName: locale => locale?.subcategoryName, // TagLocaleSubcategoryName: SubcategoryModule
      subcategoriesSorted(subcategories) {
        let NewSubcategories = []; subcategories?.filter(subcategory =>
          subcategory.posts?.[0]?.location === location.value || showAll.value ||
          subcategory.posts?.[0]?.worldwide === 1 ).forEach(subcategory => {
          const posts = subcategory.posts?.filter(post => new Date(post.end_date).getTime() > Date.now())
          if(posts.length||showAll.value) // Off Expired Post
          NewSubcategories.push({id: subcategory.id, locales: [subcategory?.locales?.[0]], PostsNumber: posts.length })
        });return NewSubcategories?.sort((a, b) => a?.locales?.[0]?.subcategoryName?.localeCompare(b?.locales?.[0]?.subcategoryName))
      }, // TagSubcategoriesSorted: SubcategoryModule

      addCategory() {
        crudAction({
          success: 'Category Added Successfully',
          url: 'api/categories',
          method: 'post',
          locale: locale.value,
          categoryName: categoryName.value,
          description: description.value,
          icon: icon.value
        }).then(() =>  categoriesAction())
          .catch(error => category_data.value = error?.response?.data?.errors?.category?.[0] || error?.response?.data?.message)
      }, // TagAddCategory: CategoryModule
      updateCategory(categoryID) {
        crudAction({
          success: 'Category Updated Successfully',
          url: `api/categories/${categoryID}`,
          method: 'put',
          categoryID: categoryID,
          locale: locale.value,
          categoryName: categoryName.value,
          description: description.value,
          icon: icon.value
        }).then(() => categoriesAction())
          .catch(e => notifyAction({error: 'updateCategoryAction', e}))
      }, // TagUpdateCategory: CategoryModule
      editCategory, // TagEditCategory: CategoryModule,
      deleteCategory(id) {
        if (confirm('Are You Sure You Want To Delete Category') === true) crudAction({
          success: 'Category Deleted Successfully',
          url: `api/categories/${id}`,
          method: 'delete',
          categoryName: 1
        }).then(() => categoriesAction())
          .catch(e => notifyAction({error: 'deleteCategoryAction', e}))
      }, // TagDeleteCategory: CategoryModule
      addSubcategory (categoryID) {
        crudAction({
          success: 'Subcategory Added Successfully',
          url: 'api/categories',
          method: 'post',
          categoryID: categoryID,
          locale: locale.value,
          subcategoryName: subcategoryName.value
        }).then(() => categoriesAction())
          .catch(error => subcategory_data.value = error?.response?.data?.errors?.subcategory?.[0] || error.response.data.message)
      }, // TagAddSubCategory: SubcategoryModule
      updateSubcategory(categoryID, id) {
        crudAction({
          success: 'Subcategory Updated Successfully',
          url: `api/categories/${id}`,
          method: 'put', id: id,
          categoryID: categoryID,
          locale: locale.value,
          subcategoryName: subcategoryName.value
        }).then(() => categoriesAction())
          .catch(e => notifyAction({error: 'updateSubcategoryAction', e}))
      }, // TagUpdateSubCategory: SubcategoryModule
      deleteSubcategory(id) {
        if (confirm('Are You Sure You Want To Delete Subcategory') === true) crudAction({
          success: 'Subcategory Deleted Successfully',
          url: `api/categories/${id}`,
          method: 'delete',
          subcategoryName: 1,
          // locale: locale.value
        }).then(() => categoriesAction())
          .catch(e => notifyAction({error: 'deleteCategoryAction', e}))
      }, // TagDeleteSubCategory: SubcategoryModule

      pagination,

      columns: [
        { name: 'pic', align: 'left', label: $t('picture'), field: 'pic', sortable: false }, // TagTablePic: PicModule
        { name: 'post_title', align: 'left', label: 'Post Title', field: 'post_title', sortable: true },
        { name: 'description', align: 'center', label: ('description'), field: 'description', sortable: true },
        { name: 'address', align: 'left', label: 'Address', field: 'address', sortable: true },
        { name: 'city', align: 'left', label: 'City', field: 'city', sortable: true },
        { name: 'postal_code', align: 'left', label: 'Postal Code', field: 'postal_code', sortable: true }
      ],  rows
    }
  }
}
</script>
