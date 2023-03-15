<template>
  <q-dialog v-model="pending"><!--========== Receipt PopUp ============-->
    <q-card class="my-card text-black">
      <q-card-section class="bg-primary text-white">
        <!-- <q-btn dense flat icon="close" class="float-right" v-close-popup /> -->
        <q-btn color="primary" text-color="white" class="float-right" dense round icon="close" v-close-popup />
        <div class="text-h6">{{$t('checkout')}}</div>
      </q-card-section>
      <Reports :pending_payments="pending_payments" />
    </q-card>
  </q-dialog><!--=========================== Receipt PopUp End ========-->
  <div class="q-pr-md" v-if="pending_payments?.length">
    <q-btn dense round flat icon="fas fa-cart-shopping" title="Shopping Cart" @click="pending=true">
      <q-badge color="orange" text-color="black" :label="pending_payments?.length" floating />
    </q-btn><!-- ========================================================= -->
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
// import { useStore } from 'vuex'
import { useCrudStore } from 'stores/crud'
import Reports from './UserReports.vue'

/**
 * Tags: TagMessage
 *
 * @from
 */
export default {
  components: {
    Reports
  },
  setup () {
    // const $store = useStore()
    const store = useCrudStore()
    const { crudAction, notifyAction } = store
    const pending_payments = ref([])

    const reload = computed(() => store['reload']?.reload)

    watch(reload, () => cart())
    onMounted(() => cart())

    function cart() {

      // shopping.value = false;
      crudAction({
        url: 'api/users/reports',
        method: 'get',
        pending: true
      }).then(res => pending_payments.value = res)
        .catch(e => notifyAction({error: 'cartAction', e}))

    }

    return {
      pending: ref(false),
      pending_payments
    }
  }
}
</script>
