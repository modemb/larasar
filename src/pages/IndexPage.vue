<template>
  <q-page class="flex flex-center">
    <div class="text-center">
        <h4 v-if="auth">{{$t('you_are_logged_in')}}</h4>
        <a  target="_blank" href="https://github.com/modemb/larasar"><i class="fab fa-github fa-3x q-mr-lg"/></a>
        <a  target="_blank" href="https://www.facebook.com/modemb.dev"><i class="fab fa-facebook fa-3x q-mr-lg"/></a>
        <a  target="_blank" href="https://www.linkedin.com/in/mohamed-dembele-85051197/"><i class="fab fa-linkedin fa-3x q-mr-lg"/></a>
        <a  target="_blank" href="https://www.patreon.com/modemb"><i class="fab fa-patreon fa-3x q-mr-lg"/></a>
        <q-separator _inset/><br/>
        <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
          <input type="hidden" name="cmd" value="_s-xclick" />
          <input type="hidden" name="hosted_button_id" value="CZ6J25TKMVQ42" />
          <button><i class="fab fa-paypal fa-3x _q-ma-lg"/></button>
        </form>
      </div>
  </q-page>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import { useCrudStore } from 'stores/crud'

  const store = useCrudStore()

  const auth = computed(() => store.authGetter)

</script>

<style  lang="sass" scoped>
.q-tab
  color: black
</style>
