<template>
  <q-page class="flex flex-center">
    <ul class="collapsible *text-center">
      <li>
        <!-- <div class="collapsible-header">
          <i class="material-icons">filter_drama</i> -->
          <h4 v-if="user" >{{$t('you_are_logged_in')}}</h4>
          <!-- <span class="new badge">4</span></div>
        <div class="collapsible-body"><p>Lorem ipsum dolor sit amet.</p></div> -->
      </li>
      <li>
        <div class="collapsible-body">
          <a  target="_blank" href="https://github.com/modemb/larasar"><i class="fab fa-github fa-5x q-mr-lg"/></a>
          <a  target="_blank" href="https://www.facebook.com/modemb.dev"><i class="fab fa-facebook fa-5x q-mr-lg"/></a>
          <a  target="_blank" href="https://www.linkedin.com/in/mohamed-dembele-85051197/"><i class="fab fa-linkedin fa-5x q-mr-lg"/></a>
        </div>
        <a target="_blank"  href="https://quasar.dev" class="logo">
          <img alt="Larasar logo" src="~assets/quasar-logo-full.svg">
        </a>
        <div class="collapsible-body">
          <a target="_blank"  href="https://laravel.com" class="logo q-mr-lg">
              <img class="mark" src="https://laravel.com/img/logomark.min.svg" alt="Laravel">
              <img class="type" src="https://laravel.com/img/logotype.min.svg" alt="Laravel">
          </a>
          <a target="_blank" id="logo" href="https://vuejs.org">
              <img src="https://vuejs.org/images/logo.png" alt="vue logo" width=50>
          </a>
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
