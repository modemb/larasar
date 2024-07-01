<template>
  <div class="q-pa-md row items-start q-gutter-md">
    <q-card
      class="my-card text-white"
      style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)"
    >
      <q-card-section>
        <div class="text-h6">{{ page_title }}</div>
        <div class="text-subtitle2">{{ description }}</div>
      </q-card-section>

      <q-separator dark inset />

      <div class="q-pa-md" v-html="content" />
    </q-card>
  </div>
</template>

<script lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { useRoute, onBeforeRouteUpdate } from 'vue-router'
import { useCrudStore } from 'stores/crud'

export default {
  setup () {
    const  store = useCrudStore()
    const { crudAction, notifyAction } = store
    const $route = useRoute()
    const page_title = ref(null)
    const description = ref(null)
    const content = ref(null)

    const locale = computed(() => store.configGetter?.locale)
    const slug = computed(() => $route.params.slug)

    onBeforeRouteUpdate((to, from, next) => next())

    onMounted (() => pageAction({e: 'mountedPage'}))

    watch([locale, slug], () => pageAction({e: 'localePage'}))

    function pageAction(data: { e: string }) {
      // if (included(slug.value)) thenGet(store[slug.value])
      // else
      crudAction({
        slug: slug.value,
        locale: locale.value,
        url: 'api/pages/showPage',
        method: 'get', mutate: slug.value
      }).then((page: { page_title: null; description: null; content: null }) => thenGet(page))
        .catch((e: unknown) => notifyAction({error: data.e, e}))
    }

    function thenGet (page: { page_title: null; description: null; content: null }) {
      page_title.value = page.page_title
      description.value = page.description
      content.value = page.content
    }

    return {
      page_title,
      description,
      content
    }
  }
}
</script>

<style lang="css" scoped>
.my-card {
  width: 100%;
  /* max-width: 250px; */
}
</style>
