<template>
    <q-page class="q-pa-md flex-center">
        {{block_chain.bitgo}}
    </q-page>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'loginPage',
  computed: mapGetters({
    block_chain: 'config/servicesGetter'
  })
}
</script>
