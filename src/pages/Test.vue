<template>
  <div>
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
  </div>
</template>

<script>
// import GoogleMapsApiLoader from 'google-maps-api-loader'
import { mapGetters } from 'vuex'

export default {
  name: 'App',
  data () {
    return {
      map: null,
      card: null,
      input: null,
      types: null,
      strictBounds: null,
      infowindow: null,
      infowindowContent: null,
      marker: null,
      place: null,
      address: null,
      autocomplete: null,
      model: null,
      // ======
      option: null
    }
  },
  computed: mapGetters({
    auth: 'users/authGetter' // NotInUse
  }),
  mounted () {
    this.initMap()
  },
  methods: {
    Place () {
      // console.log(
      //   'map',
      //   this.map,
      //   'card',
      //   this.card,
      //   'input',
      //   this.input,
      //   'types',
      //   this.types,
      //   'strictBounds',
      //   this.strictBounds,
      //   'infowindow',
      //   this.infowindow,
      //   'infowindowContent',
      //   this.infowindowContent,
      //   'marker',
      //   this.marker,
      //   'place',
      //   this.place,
      //   'address',
      //   this.address,
      //   'autocomplete',
      //   // this.autocomplete.place.place_id,
      //   this.autocomplete.place.address_components,
      //   'model',
      //   this.model
      // )
    },
    initMap () {
      // var input = document.getElementById('pac-input') // this.$refs.myDiv in Vue
      var input = this.$refs['pac-input']

      // eslint-disable-next-line no-undef
      var autocomplete = new google.maps.places.Autocomplete(input)

      autocomplete.addListener('place_changed', function () {
        var place = autocomplete.getPlace(); this.place = place
        if (!place.geometry) {
          // User entered the name of a Place that was not suggested and
          // pressed the Enter key, or the Place Details request failed.
          window.alert("No details available for input: '" + place.name + "'")
        }
      })

      // Sets a listener on a radio button to change the filter type on Places
      // Autocomplete.
      function setupClickListener (id, types) {
        var radioButton = document.getElementById(id)
        radioButton.addEventListener('click', () => {
          autocomplete.setTypes(types)
        })
      }

      setupClickListener('changetype-all', [])
      setupClickListener('changetype-address', ['address'])
      setupClickListener('changetype-establishment', ['establishment'])
      setupClickListener('changetype-geocode', ['geocode'])

      document.getElementById('use-strict-bounds')
        .addEventListener('click', () => {
          // console.log('Checkbox clicked! New state=' + this.checked)
          autocomplete.setOptions({ strictBounds: this.checked })
        }); this.autocomplete = autocomplete
    },
    test () {
      this.$crudAction({
        url: 'api/test',
        method: 'post'
      }).then(test => console.log('test', test))
        .catch(e => this.$notifyAction({error: 'test', e}))
      // console.log('window', window)
      // console.log('githubAuth', this.githubAuth, 'url', this.url)
      // this.$axios.get(`api/test`).then(response => {
      //   // console.log(response)
      //   this.$store.dispatch('users/authAction')
      //   this.$q.notify({
      //     color: 'positive',
      //     position: 'top',
      //     message: this.$t(response),
      //     icon: 'check'
      //   })
      // })
    }
  }
}
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
