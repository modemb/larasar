<template>
  <div class="q-ma-md">
    <div class="pac-card" id="pac-card">
      <div>
        <div id="title">
          Autocomplete search
        </div>
        <div id="type-selector" class="pac-controls">
          <input type="radio" name="type" id="changetype-all" checked="checked">
          <label for="changetype-all">All</label>

          <input type="radio" name="type" id="changetype-establishment">
          <label for="changetype-establishment">Establishments</label>

          <input type="radio" name="type" id="changetype-address">
          <label for="changetype-address">Addresses</label>

          <input type="radio" name="type" id="changetype-geocode">
          <label for="changetype-geocode">Geocodes</label>
        </div>
        <div id="strict-bounds-selector" class="pac-controls">
          <input type="checkbox" id="use-strict-bounds" value="">
          <label for="use-strict-bounds">Strict Bounds</label>
        </div>
      </div>
      <div id="pac-container" class="q-pa-md">
        <input
          id="pac-input"
          ref="pac-input"
          type="text"
          v-model="model"
          :options="option"
          placeholder="Enter a location"
        />
        <q-btn class="*glossy" flat
          icon="fas fa-search"
          @click.prevent="Place"
        />
        <q-btn class="*glossy" flat
          label="test"
          @click.prevent="test"
        />
      </div>
    </div>

    <!-- <div id="map"></div> -->
    <!-- <div id="*infowindow-content">
      <img src="" width="16" height="16" id="place-icon">
      <span id="place-name"  class="title"></span><br>
      <span id="place-address"></span>
    </div> -->

    <div>
      <!-- Option 1 -->
      <div>Direct store</div>
      <!-- Read the state value directly -->
      <div>{{ store.counter }}</div>
      <!-- Use getter directly -->
      <div>{{ store.doubleCount }}</div>

      <!-- Manipulate state directly -->
      <q-btn @click="store.counter--">-</q-btn>
      <!-- Use an action -->
      <q-btn @click="store.increment()">+</q-btn>
    </div>

    <div>
      <!-- Option 2 -->
      <div>Indirect store</div>
      <!-- Use the computed state -->
      <div>{{ count }}</div>
      <!-- Use the computed getter -->
      <div>{{ doubleCountValue }}</div>

      <!-- Use the exposed function -->
      <q-btn @click="decrementCount()">-</q-btn>
      <!-- Use the exposed function -->
      <q-btn @click="incrementCount()">+</q-btn>
    </div>

    <div>
      <!-- Option 3 -->
      <div>Destructured store</div>
      <!-- Use the destructured state -->
      <div>{{ counter }}</div>
      <!-- Use the destructured getter -->
      <div>{{ doubleCount }}</div>

      <!-- Manipulate state directly-->
      <q-btn @click="counter--">-</q-btn>
      <!-- Use an action -->
      <q-btn @click="increment()">+</q-btn>
    </div>
  </div>
</template>

<script lang="ts">
// import { mapGetters } from 'vuex'
import { computed, defineComponent } from 'vue'
import { storeToRefs } from 'pinia'
import { useCounterStore2 } from 'stores/counter'

// import GoogleMapsApiLoader from 'google-maps-api-loader'

export default defineComponent({
  name: 'App',
  setup() {
    const store = useCounterStore2();
    // $router.push('/test')

    // Option 2: use computed and functions to use the store
    const count = computed(() => store.counter);
    const doubleCountValue = computed(() => store.doubleCount);
    const incrementCount = () => store.increment(); // use action
    const decrementCount = () => store.counter--; // manipulate directly

    // Option 3: use destructuring to use the store in the template
    const { counter, doubleCount } = storeToRefs(store); // state and getters need "storeToRefs"
    const { increment } = store; // actions can be destructured directly

    return {
      // Option 1: return the store directly and couple it in the template
      store,

      // Option 2: use the store in functions and compute the state to use in the template
      count,
      doubleCountValue,
      incrementCount,
      decrementCount,

      // Option 3: pass the destructed state, getters and actions to the template
      counter,
      increment,
      doubleCount,
    }
  } // https://pinia.vuejs.org/core-concepts/#option-stores


  // data () {
  //   return {
  //     Cookies,
  //     map: null,
  //     card: null,
  //     input: null,
  //     types: null,
  //     strictBounds: null,
  //     infowindow: null,
  //     infowindowContent: null,
  //     marker: null,
  //     place: null,
  //     address: null,
  //     autocomplete: null,
  //     model: null,
  //     // ======
  //     option: null
  //   }
  // },
  // // computed: mapGetters({
  // //   auth: 'users/authGetter' // NotInUse
  // // }),
  // mounted () {
  //   this.initMap()
  // },
  // methods: {
  //   Place () {
  //     // console.log(
  //     //   'map',
  //     //   this.map,
  //     //   'card',
  //     //   this.card,
  //     //   'input',
  //     //   this.input,
  //     //   'types',
  //     //   this.types,
  //     //   'strictBounds',
  //     //   this.strictBounds,
  //     //   'infowindow',
  //     //   this.infowindow,
  //     //   'infowindowContent',
  //     //   this.infowindowContent,
  //     //   'marker',
  //     //   this.marker,
  //     //   'place',
  //     //   this.place,
  //     //   'address',
  //     //   this.address,
  //     //   'autocomplete',
  //     //   // this.autocomplete.place.place_id,
  //     //   this.autocomplete.place.address_components,
  //     //   'model',
  //     //   this.model
  //     // )
  //   },
  //   initMap () {
  //     // var input = document.getElementById('pac-input') // this.$refs.myDiv in Vue
  //     var input = this.$refs['pac-input']

  //     // eslint-disable-next-line no-undef
  //     var autocomplete = new google.maps.places.Autocomplete(input)

  //     autocomplete.addListener('place_changed',  () => {
  //       var place = autocomplete.getPlace(); this.place = place
  //       if (!place.geometry) {
  //         // User entered the name of a Place that was not suggested and
  //         // pressed the Enter key, or the Place Details request failed.
  //         window.alert("No details available for input: '" + place.name + "'")
  //       }
  //     })

  //     // Sets a listener on a radio button to change the filter type on Places
  //     // Autocomplete.
  //     function setupClickListener (id: string, types: string[]) {
  //       var radioButton = document.getElementById(id)
  //       radioButton.addEventListener('click', () => {
  //         autocomplete.setTypes(types)
  //       })
  //     }

  //     setupClickListener('changetype-all', [])
  //     setupClickListener('changetype-address', ['address'])
  //     setupClickListener('changetype-establishment', ['establishment'])
  //     setupClickListener('changetype-geocode', ['geocode'])

  //     document.getElementById('use-strict-bounds')
  //       .addEventListener('click', () => {
  //         // console.log('Checkbox clicked! New state=' + this.checked)
  //         autocomplete.setOptions({ strictBounds: this.checked })
  //       }); this.autocomplete = autocomplete
  //   },
  //   test () {
  //     // COMPLETED = {"statusCode":201,"result":{"id":"0PY21499W8316361N","intent":"CAPTURE","status":"COMPLETED","payment_source":{"paypal":{"email_address":"modembfr@gmail.com","account_id":"UZHCGG3Q6VG5Y","name":{"given_name":"Mohamed","surname":"Dembele"},"address":{"country_code":"CA"}}},"purchase_units":[{"reference_id":"default","amount":{"currency_code":"USD","value":"2.00"},"payee":{"email_address":"modembfr-facilitator@gmail.com","merchant_id":"4AKB8NDX6N8ZJ"},"soft_descriptor":"PAYPAL *TESTFACILIT","shipping":{"name":{"full_name":"Mohamed Dembele"},"address":{"address_line_1":"3246-A Avenue Bourassa","admin_area_2":"Boisbriand","admin_area_1":"QC","postal_code":"J7H 1B4","country_code":"CA"}},"payments":{"captures":[{"id":"667090236K349102X","status":"COMPLETED","amount":{"currency_code":"USD","value":"2.00"},"final_capture":true,"seller_protection":{"status":"ELIGIBLE","dispute_categories":["ITEM_NOT_RECEIVED","UNAUTHORIZED_TRANSACTION"]},"seller_receivable_breakdown":{"gross_amount":{"currency_code":"USD","value":"2.00"},"paypal_fee":{"currency_code":"USD","value":"0.36"},"net_amount":{"currency_code":"USD","value":"1.64"}},"links":[{"href":"https:\/\/api.sandbox.paypal.com\/v2\/payments\/captures\/667090236K349102X","rel":"self","method":"GET"},{"href":"https:\/\/api.sandbox.paypal.com\/v2\/payments\/captures\/667090236K349102X\/refund","rel":"refund","method":"POST"},{"href":"https:\/\/api.sandbox.paypal.com\/v2\/checkout\/orders\/0PY21499W8316361N","rel":"up","method":"GET"}],"create_time":"2022-07-21T20:09:40Z","update_time":"2022-07-21T20:09:40Z"}]}}],"payer":{"name":{"given_name":"Mohamed","surname":"Dembele"},"email_address":"modembfr@gmail.com","payer_id":"UZHCGG3Q6VG5Y","address":{"country_code":"CA"}},"create_time":"2022-07-21T20:09:14Z","update_time":"2022-07-21T20:09:40Z","links":[{"href":"https:\/\/api.sandbox.paypal.com\/v2\/checkout\/orders\/0PY21499W8316361N","rel":"self","method":"GET"}]},"headers":{"":"","Content-Type":"application\/json","Content-Length":"1878","Connection":"keep-alive","Date":"Thu, 21 Jul 2022 20","Application_id":"APP-80W284485P519543T","Cache-Control":"max-age=0, no-cache, no-store, must-revalidate","Caller_acct_num":"4AKB8NDX6N8ZJ","Paypal-Debug-Id":"26c01caa8c2fc","Strict-Transport-Security":"max-age=31536000; includeSubDomains"}}
  //     // CREATED = {"statusCode":201,"result":{"id":"1T4264444D6689142","intent":"CAPTURE","status":"CREATED","purchase_units":[{"reference_id":"default","amount":{"currency_code":"USD","value":"2.00"},"payee":{"email_address":"modembfr-facilitator@gmail.com","merchant_id":"4AKB8NDX6N8ZJ"}}],"create_time":"2022-07-22T22:59:24Z","links":[{"href":"https:\/\/api.sandbox.paypal.com\/v2\/checkout\/orders\/1T4264444D6689142","rel":"self","method":"GET"},{"href":"https:\/\/www.sandbox.paypal.com\/checkoutnow?token=1T4264444D6689142","rel":"approve","method":"GET"},{"href":"https:\/\/api.sandbox.paypal.com\/v2\/checkout\/orders\/1T4264444D6689142","rel":"update","method":"PATCH"},{"href":"https:\/\/api.sandbox.paypal.com\/v2\/checkout\/orders\/1T4264444D6689142\/capture","rel":"capture","method":"POST"}]},"headers":{"":"","Content-Type":"application\/json","Content-Length":"740","Connection":"keep-alive","Date":"Fri, 22 Jul 2022 22","Application_id":"APP-80W284485P519543T","Cache-Control":"max-age=0, no-cache, no-store, must-revalidate","Caller_acct_num":"4AKB8NDX6N8ZJ","Paypal-Debug-Id":"7addd2ffd89b9","Strict-Transport-Security":"max-age=31536000; includeSubDomains"}}

  //     this.$crudAction({
  //       url: 'api/test',
  //       method: 'post'
  //     }).then((test: unknown) => console.log('test', test))
  //       .catch((e: unknown) => this.$notifyAction({error: 'test', e}))
  //     // console.log('window', window)
  //     // console.log('githubAuth', this.githubAuth, 'url', this.url)
  //     // this.$axios.get(`api/test`).then(response => {
  //     //   // console.log(response)
  //     //   this.$store.dispatch('users/authAction')
  //     //   this.$q.notify({
  //     //     color: 'positive',
  //     //     position: 'top',
  //     //     message: this.$t(response),
  //     //     icon: 'check'
  //     //   })
  //     // })
  //   }
  // }
})
</script>

<style scoped>
  /* Always set the map height explicitly to define the size of the div
    * element that contains the map. */
  #map {
    height: 100%;
  }
  /* Optional: Makes the sample page fill the window. */
  html, body {
    height: 100%;
    margin: 0;
    padding: 0;
  }
  #description {
    font-family: Roboto;
    font-size: 15px;
    font-weight: 300;
  }

  #infowindow-content .title {
    font-weight: bold;
  }

  #infowindow-content {
    display: none;
  }

  #map #infowindow-content {
    display: inline;
  }

  .pac-card {
    margin: 10px 10px 0 0;
    border-radius: 2px 0 0 2px;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    outline: none;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
    background-color: #fff;
    font-family: Roboto;
  }

  #pac-container {
    padding-bottom: 12px;
    margin-right: 12px;
  }

  .pac-controls {
    display: inline-block;
    padding: 5px 11px;
  }

  .pac-controls label {
    font-family: Roboto;
    font-size: 13px;
    font-weight: 300;
  }

  #pac-input {
    background-color: #fff;
    font-family: Roboto;
    font-size: 15px;
    font-weight: 300;
    margin-left: 12px;
    padding: 0 11px 0 13px;
    text-overflow: ellipsis;
    width: 400px;
  }

  #pac-input:focus {
    border-color: #4d90fe;
  }

  #title {
    color: #fff;
    background-color: #4d90fe;
    font-size: 25px;
    font-weight: 500;
    padding: 6px 12px;
  }
</style>
