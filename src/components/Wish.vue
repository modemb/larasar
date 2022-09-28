<template>
    <q-btn :loading="loader" class="float-right q-ma-sm" size="12px"
      flat dense round @click.prevent="favorite(post)" v-if="auth"
    ><q-icon name="fas fa-heart" style="font-size: 2.4em;"
        :class="!wish(post)||'text-red'"
      /><!-- TagFavorite: FavoriteModule -->
    </q-btn>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { crudAction, notifyAction } from 'boot/axios'

export default {
  props: ['post'],
  setup (props, { emit }) {
    const $store = useStore()
    const loader = ref(false)
    const auth = computed(() => $store.getters['users/authGetter'])

    return {
      loader,
      auth,

      wish: post => post?.favorite?.wish, // TagFavorite: FavoriteModule

      favorite (post) {
        loader.value = true
        const id = post?.favorite?.id
        const method = id ? 'put' : 'post'
        let url = id ? `api/categories/${id}` : 'api/categories'
        crudAction({
          url, method,
          favorite: true,
          user_id: auth.value.id,
          post_id: post.id
        }).then(crud => {
          loader.value = false
          const favorite = crud?.wish // wishCycle
          if (favorite) emit('favorite') // Categories
        }).catch(e => notifyAction({error: 'AddToFavorite', e}))
      } // TagFavorite: FavoriteModule
    }
  }
}
</script>

