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

      <q-card-section class="q-pt-none" v-html="content"></q-card-section>
    </q-card>
  </div>
</template>

<script>
import { ref, watch, onMounted, computed } from 'vue'
import { useRoute, onBeforeRouteUpdate } from 'vue-router'
import { useStore } from 'vuex'
import { crudAction, notifyAction } from 'boot/axios'

export default {
  setup () {
    const $store = useStore()
    const $route = useRoute()
    const page_title = ref(null)
    const description = ref(null)
    const content = ref(null)

    const locale = computed(() => $store.getters['config/localeGetter'])
    const slug = computed(() => $route.params.slug)

    onBeforeRouteUpdate( (to, from, next) => next())

    onMounted (() => crud({e: 'mountedPage'}))

    watch([locale, slug], () => crud({e: 'localePage'}))

    function crud (data) {
        crudAction({
          slug: slug.value,
          locale: locale.value,
          url: 'api/pages/1',
          method: 'get',
          showPage: 1
        }).then(page => thenGet(page))
          .catch(e => notifyAction({error: data.e, e}))
    }

    function thenGet (page) {
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
  *max-width: 250px;
}
</style>
