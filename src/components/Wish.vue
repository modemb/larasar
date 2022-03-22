<template>
    <q-btn :loading="loader" class="float-right q-ma-sm" size="12px"
      flat dense round @click.prevent="favorite(post)" v-if="auth"
    ><q-icon name="fas fa-heart" style="font-size: 2.4em;"
        :class="!wish(post)||'text-red'"
      /><!-- TagFavorite: FavoriteModule -->
    </q-btn>
</template>

<script>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { crudAction, notifyAction } from 'boot/axios'

export default {
  props: ['post', 'auth'],
  setup (props, { emit }) {
    const $store = useStore()
    const $route = useRoute()
    const loader = ref(false)
    const auth = $store.getters['users/authGetter']

    return {
      crudAction,
      loader,

      favorite (post) {
        loader.value = true
        let id = false; try {
          id = post.favorite.id
          // id = posts.post.favorite.id
        } catch (error) {}
        let method = id ? 'put' : 'post'
        let url = id ? `api/categories/${id}` : 'api/categories'
        crudAction({
          // error: 'AddToFavorite',
          url: url,
          method: method,
          favorite: true,
          user_id: auth.id,
          post_id: post.id
        }).then(crud => {
          loader.value = false
          let favorite; try {
            favorite = crud.wish // wishCycle
          } catch (error) {}
          if (favorite) emit('favorite', $route)
        }).catch(e => notifyAction({error: 'AddToFavorite', e}))
      }, // TagFavorite: FavoriteModule
      wish (post) {
        try {
          return post.favorite.wish
        } catch (error) {} return false
      } // TagFavorite: FavoriteModule
    }
  }
}
</script>

