<template>
  <q-dialog v-model="pending"><!--========== Receipt PopUp ============-->
    <q-card class="my-card text-black">
      <q-card-section class="bg-primary text-white">
        <q-btn dense round icon="close" class="float-right" v-close-popup />
        <div class="text-h6">{{$t('checkout')}}</div>
      </q-card-section>
      <Reports :pending_payments="pending_payments" />
    </q-card>
  </q-dialog><!--=========================== Receipt PopUp End ========-->
  <div class="q-pr-md" v-if="pending_payments?.length">
    <q-btn dense round flat icon="fas fa-cart-shopping" title="Shopping Cart" @click="pending=true">
      <q-badge color="orange" text-color="black" :label="pending_payments?.length" floating />
    </q-btn><!-- ===================================================== -->
  </div>
</template>

<script lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useCrudStore } from 'stores/crud'
import { api } from 'boot/axios'
import Reports from './UserReports.vue'

/**
 * Tags: TagMessage
 *
 * @to
 */
export default {
  components: {
    Reports
  },
  setup () {
    const store = useCrudStore()
    const { crudAction, notifyAction } = store
    const pending_payments = ref([])

    const auth = computed(() => store.authGetter)
    const reload = computed(() => store.reloadGetter?.reload)

    onMounted(() => cart())

    function cart() {

      api.get('api/users/reports', { params: { pending: true } })
        .then(({ data }) => pending_payments.value = data.filter(
          (r: { user_id: number }) => auth.value.id === r.user_id
        )).catch(e => notifyAction({error: 'cartPending', e}))

      // shopping.value = false;
      // crudAction({
      //   url: 'api/users/reports',
      //   method: 'get',pending: true,
      //   mutate: 'reportsGetter'
      // }).then((res: { filter: (arg0: (r: { user_id: number }) => boolean) => never[] }) => pending_payments.value = res.filter(
      //   (r: { user_id: number }) => auth.value.id === r.user_id
      // )).catch((e: unknown) => notifyAction({error: 'cartAction', e}))

    } watch(reload, () => cart())

    return {
      pending: ref(false),
      pending_payments
    }
  }
}
</script>
