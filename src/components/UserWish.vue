<template>
    <q-btn flat dense round  size="12px"
      class="float-right q-ma-sm"
      @click.prevent="favorite(post)" :loading="loader"
      v-if="auth?.id !== post?.user?.id&&!post?.fav"
      ><q-icon name="fas fa-heart" style="font-size:2.4em"
        :class="!wish(post)||'text-red'"
      /><!-- TagFavorite: FavoriteModule &&post?.favorite-->
    </q-btn>
</template>

<script lang="ts">
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useCrudStore } from 'stores/crud'

export default {
  props: ['post'],
  setup (props, { emit }) {
    const $store = useStore()
    const { crudAction, notifyAction } = useCrudStore()
    const loader = ref(false)
    const auth = computed(() => $store.getters['users/authGetter'])

    return {
      loader,
      auth,

      wish: (post: { favorite: { wish: boolean } }) => post?.favorite?.wish, // TagFavorite: FavoriteModule
     
      favorite(post: { favorite: { id: number }; id: number }) {
        if (!auth.value) return notifyAction({success: 'Please Login'})
        const id = post?.favorite?.id
        const method = id ? 'put' : 'post'; loader.value = true
        const url = id ? `api/categories/${id}` : 'api/categories'
        crudAction({
          url, method,
          favorite: true,
          user_id: auth.value?.id,
          post_id: post.id
        }).then((crud: { wish: boolean }) => {
          loader.value = false
          const favorite = crud?.wish // wishBool
          if (favorite) emit('favorite') // Categories
        }).catch((e: string) => notifyAction({error: 'AddToFavorite', e}))
      } // TagFavorite: FavoriteModule
    }
  }
}
</script>

