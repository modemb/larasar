<template>
    <q-btn flat dense round  size="12px"
      class="float-right q-ma-sm"
      @click.prevent="wishAction(post)"
      v-if="auth?.id !== post?.user?.id&&!post?.fav"
      ><q-icon name="fas fa-heart" style="font-size:2.4em"
        :class="bool?'text-red':''"
      /><!-- TagFavorite: FavoriteModule -->
    </q-btn>
</template>

<script lang="ts">
import { computed } from 'vue'
import { useCrudStore } from 'stores/crud'

export default {
  props: ['post'],
  setup (props) {
    const store = useCrudStore()
    const { crudAction, notifyAction } = store

    const getters = computed(() => 'wishGetter'+props.post?.id)
    const auth = computed(() => store.authGetter)

    return {
      auth,
      bool: computed(() => store[getters.value]??props.post?.favorite?.wish),

      wishAction(post: { favorite: { id: number }; id: number }) {
        if (!auth.value) return notifyAction({success: 'Please Login'})
        const id = post?.favorite?.id
        const method = id ? 'put' : 'post'
        const url = id ? `api/categories/${id}` : 'api/categories'
        crudAction({
          url, method,
          post_id: post.id,
          user_id: auth.value?.id,
          mutate: getters.value, favorite: true,
          refresh: [getters.value, 'favoritesGetter']
        }).catch((e: unknown) => notifyAction({error: 'wishAction', e}))
      } // TagFavorite: FavoriteModule
    }
  }
}
</script>

