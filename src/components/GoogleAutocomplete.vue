<template>
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
      <div id="pac-container">
        <input type="text" id="pac-input" v-model="model" placeholder="Enter a location">
          <q-btn class="*glossy" flat
            icon="fas fa-search"
            @click.prevent="place"
          />
      </div>
    </div>
    <div id="map"></div>
    <div id="infowindow-content" class="q-gutter-md row">
      <img src="" width="16" height="16" id="place-icon">
      <span id="place-name"  class="title"></span><br>
      <span id="place-address"></span>
    </div>

    <q-input outlined class="col-lg-6 search" @keyup.enter="autocomplete-input" v-model="search_place" :label="$t('search_place')" >
      <template v-slot:append class="*col-lg-7">
        <form class="main-search-input center-block">
          <div class="main-search-input-item location">
              <div id="autocomplete-container">
                  <input id="autocomplete-input" type="text" name="city" placeholder="Type in City Name"/>
              </div>
          </div><!-- <button class="button">Search</button> -->
        </form>
        <q-btn :color="init?'negative':'primary'"
          flat :loading="loader"
          icon="fas fa-search"
          @click.prevent="initAutocomplete"
        />
      </template>
    </q-input><!-- TagSearch: MobileSearchModule -->
</template>

<script>
import { ref, watch } from 'vue'
// import GoogleMapsApiLoader from 'google-maps-api-loader'

export default {
  name: 'App',
  setup () {
    // const $store = useStore()
    // const $route = useRoute()
    // const Map = ref(null)
    // const Card = ref(null)
    // const Place = ref(null)
    // const Input = ref(null)
    // const Types = ref(null)
    // const checked = ref(null)
    // const StrictBounds = ref(null)
    // const Infowindow = ref(null)
    // const InfowindowContent = ref(null)
    // const Marker = ref(null)
    // const Address = ref(null)
    // const Autocomplete = ref(null)

    const init = ref(false)
    const search_place = ref(null)

    // onMounted (() => initMap())

    // function initMap () {
    //   const map = new google.maps.Map(document.getElementById('map'), {
    //     center: { lat: -33.8688, lng: 151.2195 },
    //     zoom: 13
    //   }); Map.value = map
    //   const card = document.getElementById('pac-card'); Card.value = card
    //   const input = document.getElementById('pac-input'); Input.value = input
    //   const types = document.getElementById('type-selector'); Types.value = types
    //   const strictBounds = document.getElementById('strict-bounds-selector'); StrictBounds.value = strictBounds

    //   map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card)

    //   const autocomplete = new google.maps.places.Autocomplete(input)

    //   // Bind the map's bounds (viewport) property to the autocomplete object,
    //   // so that the autocomplete requests use the current map bounds for the
    //   // bounds option in the request.
    //   autocomplete.bindTo('bounds', map)

    //   // Set the data fields to return when the user selects a place.
    //   autocomplete.setFields(
    //     ['address_components', 'geometry', 'icon', 'name'])

    //   const infowindow = new google.maps.InfoWindow(); Infowindow.value = infowindow
    //   const infowindowContent = document.getElementById('infowindow-content'); InfowindowContent.value = infowindowContent

    //   infowindow.setContent(infowindowContent)

    //   const marker = new google.maps.Marker({
    //     map: map,
    //     anchorPoint: new google.maps.Point(0, -29)
    //   }); Marker.value = marker

    //   autocomplete.addListener('place_changed', function () {
    //     infowindow.close()
    //     marker.setVisible(false)
    //     const place = autocomplete.getPlace(); this.place = place
    //     if (!place.geometry) {
    //       // User entered the name of a Place that was not suggested and
    //       // pressed the Enter key, or the Place Details request failed.
    //       window.alert("No details available for input: '" + place.name + "'")
    //       return
    //     }

    //     // If the place has a geometry, then present it on a map.
    //     if (place.geometry.viewport) {
    //       map.fitBounds(place.geometry.viewport)
    //     } else {
    //       map.setCenter(place.geometry.location)
    //       map.setZoom(17) // Why 17? Because it looks good.
    //     }
    //     marker.setPosition(place.geometry.location)
    //     marker.setVisible(true)

    //     const address = ''
    //     if (place.address_components) {
    //       address = [
    //         (place.address_components[0] && place.address_components[0].short_name || ''),
    //         (place.address_components[1] && place.address_components[1].short_name || ''),
    //         (place.address_components[2] && place.address_components[2].short_name || '')
    //       ].join(' ')
    //     } Address.value = address

    //     infowindowContent.children['place-icon'].src = place.icon
    //     infowindowContent.children['place-name'].textContent = place.name
    //     infowindowContent.children['place-address'].textContent = address
    //     infowindow.open(map, marker)
    //   })

    //   // Sets a listener on a radio button to change the filter type on Places
    //   // Autocomplete.
    //   function setupClickListener (id, types) {
    //     const radioButton = document.getElementById(id)
    //     radioButton.addEventListener('click', function () {
    //       autocomplete.setTypes(types)
    //     })
    //   }

    //   setupClickListener('changetype-all', [])
    //   setupClickListener('changetype-address', ['address'])
    //   setupClickListener('changetype-establishment', ['establishment'])
    //   setupClickListener('changetype-geocode', ['geocode'])

    //   document.getElementById('use-strict-bounds')
    //     .addEventListener('click', function () {
    //       // console.log('Checkbox clicked! New state=' + checked.value)
    //       autocomplete.setOptions({ strictBounds: checked.value })
    //     }); Autocomplete.value = autocomplete
    // }

    return {
      model: ref(null),
      search_place,
      init,

      place () {
        // console.log(
        //   'map',
        //   Map.value,
        //   'card',
        //   Card.value,
        //   'input',
        //   Input.value,
        //   'types',
        //   Types.value,
        //   'strictBounds',
        //   StrictBounds.value,
        //   'infowindow',
        //   Infowindow.value,
        //   'infowindowContent',
        //   InfowindowContent.value,
        //   'marker',
        //   Marker.value,
        //   'place',
        //   Place.value,
        //   'address',
        //   Address.value,
        //   'autocomplete',
        //   Autocomplete.value,
        //   'model',
        //   model.value
        // )
      },
      initAutocomplete () {
        init.value = true // const input = document.querySelector('#autocomplete-input')
        const input = document.getElementById('autocomplete-input') // this.$refs.myDiv in Vue

        const autocomplete = new google.maps.places.Autocomplete(input)

        watch([search_place, autocomplete, input], val => console.log('search_place', val))

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace()
          if (!place.geometry) {
            window.alert("No details available for input: '" + place.name + "'")
            return
          }
        })

        if (document.querySelector('.main-search-input-item')[0]) {
          setTimeout(() => {
            document.querySelector('.pac-container').prependTo('#autocomplete-container')
          }, 300)
        }
      }, // ============== Google Autocomplete =============
      async filterFn (val, update) { // NotInUse
        // const data = await api.get('https://maps.googleapis.com/maps/api/place/autocomplete/output?parameters=' + val)
        update(() => {
          // console.log('filterFn', data)
        })
      } // ============== Google Autocomplete =============
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
    /* display: inline; */
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
