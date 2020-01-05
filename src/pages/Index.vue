<template>
  <q-page class="flex flex-center">
    <ul class="collapsible">
      <li>
        <!-- <div class="collapsible-header">
          <i class="material-icons">filter_drama</i> -->
          <h4 v-if="user" >{{$t('you_are_logged_in')}}</h4>
          <!-- <span class="new badge">4</span></div>
        <div class="collapsible-body"><p>Lorem ipsum dolor sit amet.</p></div> -->
      </li>
        <q-uploader
          url="http://localhost:8080/upload"
          style="max-width: 300px"
        />
      <li>
        <!-- <div class="collapsible-header">
          <i class="material-icons">place</i> -->
          <img alt="Larasar logo" src="~assets/quasar-logo-full.svg">
          <!-- <span class="badge">1</span></div>
        <div class="collapsible-body"><p>Lorem ipsum dolor sit amet.</p></div> -->
        <!-- <q-item clickable tag="a" target="_blank" href="https://github.com/modemb/larasar">
          <h4 class="fab fa-github"> Github</h4>
        </q-item> -->
        <div class="collapsible-body">
          <a  target="_blank" href="https://github.com/modemb/larasar"><h4 class="fab fa-github">Github</h4></a>
          <a  target="_blank" href="https://www.facebook.com/modemb.dev"><h4 class="fab fa-facebook">Facebook</h4></a>
        </div>
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
