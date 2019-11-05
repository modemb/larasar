<template>
  <q-page class="flex flex-center">
    <ul class="collapsible">
      <li>
        <!-- <div class="collapsible-header">
          <i class="material-icons">filter_drama</i> -->
          <h4 v-if="user" >You are logged in!</h4>
          <!-- <span class="new badge">4</span></div>
        <div class="collapsible-body"><p>Lorem ipsum dolor sit amet.</p></div> -->
      </li>
      <li>
        <!-- <div class="collapsible-header">
          <i class="material-icons">place</i> -->
          <a class="col s12" target="_blank" href="http://modemb.com/"><img alt="Larasar logo" title="MoDemb" src="~assets/quasar-logo-full.svg"></a>
          <!-- <span class="badge">1</span></div>
        <div class="collapsible-body"><p>Lorem ipsum dolor sit amet.</p></div> -->
      </li>
    </ul>
  </q-page>
</template>

<style scoped>
  ul {list-style-type: none}
</style>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'PageIndex',
  computed: mapGetters({
    user: 'users/authGetter'
  })
}
</script>
