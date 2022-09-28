<template>
  <div class="q-pa-md">

    <div class="row text-center q-dark text-h6">
      <div class="col-4">{{time}}</div><!-- Time -->
      <div class="col-4" v-if="temperature">
        {{temperature}} <span id="temperature" />
      </div><!-- Weather -->
      <div class="col-4">
        <img :src="weather" floating />
      </div><!-- icon v-if="weather" -->
      <!-- , {{ location.coords.latitude }}, {{ location.coords.longitude}} -->
      <div id="map"></div>
    </div>

    <q-tabs
      v-model="tab"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="justify"
      narrow-indicator
    >
      <q-tab name="current_location" icon="fas fa-location-arrow" :label="$t('current_location')" />
      <q-tab name="choose_location" icon="fas fa-map-marker-alt" :label="$t('choose_location')" />
      <q-tab name="add_location" icon="maps_ugc" :label="$t('add_location')" v-if="role.admins" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="current_location">
        <div v-cloak>
          <div class="row text-h6">
            <div class="col-6">
              {{location.toLowerCase().includes(userData.city.toLowerCase())?
              $t('Your location is'):$t('Let us locate you for better results...')}}
            </div><!-- <q-btn :label="$t('Get location')" @click="locateMe" /> -->
            <div class="col-6">
              <q-btn color="primary"
                :loading="loader" icon="fas fa-map-pin"
                :label="$t(location||'Get location')"
                @click.prevent="locateMe"
              /><!-- TagGetLocation -->
            </div>
          </div>

          <div v-if="errorStr">
            Sorry, but the following error
            occurred: {{errorStr}}
          </div>

          <div v-if="gettingLocation">
            <i>{{$t('Getting your location...')}}</i>
          </div>

        </div><!-- TagSelectCountry: CountryModule -->
      </q-tab-panel><!-- TagLocateMe: SearchModule -->

      <q-tab-panel name="choose_location">
        <div class="q-gutter-md *row">
          <q-select
            filled class="*col-12"
            v-model="country"
            fill-input
            use-input
            hide-selected
            transition-show="*flip-up"
            transition-hide="*flip-down"
            behavior="*dialog"
            input-debounce="0"
            :options="Countries"
            @filter="filterFn" clearable
            :hint="$t(advance?'Advanced Filter':'Filter')"
            style="width: 100%; padding-bottom: 32px"
          ><!-- https://quasar.dev/vue-components/select#Example--Basic-filtering -->
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  {{$t('No results')}}
                </q-item-section>
              </q-item>
            </template>
            <q-btn :color="advance?'negative':'grey'"
              @click="advance=!advance"
              icon="fas fa-search"
            /><!-- TagAdvanceSearch: CountryModule -->
          </q-select>
        </div><!-- TagSelectCountry: CountryModule -->
        <div class="row">
          <q-list class="*col-md-6 col-6">
            <div v-for="(city, key) in cities" :key="key">
              <q-item tag="label" v-ripple>
                <q-item-section avatar>
                  <!-- <q-radio v-model="city" :val="city"  /> -->
                  <q-radio v-model="chooseCity" :val="city" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{city}}</q-item-label>
                </q-item-section>
              </q-item>
            </div><!-- TagRadioCity: CountryModule -->
          </q-list>
          <q-list class="*col-md-6 col-6"><!-- https://quasar.dev/style/positioning#Introduction -->
            <div v-for="(city, key) in StatesCities" :key="key">
              <q-item tag="label" v-ripple>
                <q-item-section avatar>
                  <!-- <q-radio v-model="city" :val="city"  /> -->
                  <q-radio v-model="chooseStateCity" :val="city" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{city}}</q-item-label>
                </q-item-section>
              </q-item>
            </div><!-- TagRadioCity: CountryModule -->
          </q-list>
        </div>
      </q-tab-panel><!-- TagChooseLocation: SearchModule -->

      <q-tab-panel name="add_location">
        <div v-cloak>
          <google-autocomplete/>
        </div>
      </q-tab-panel><!-- TagAddLocation: SearchModule -->
    </q-tab-panels>

    <q-form @submit="onSubmit" class="q-gutter-md">
      <div class="q-mt-xl">
        <q-slider
          :name="$t('distance')"
          v-model="km"
          label-always
          :min="1"
          :max="1000"
          :step="1"
        />
      </div>

      <div class="row">
        <div class="col-8">
          <q-btn :label="$t('Set')" type="submit" color="primary" class="q-ma-xs"/>
          <q-btn :label="$t('Reset')" @click="reset" color="primary"/>
        </div>
        <div
          v-for="(item, index) in submitResult"
          :key="index" class="col-4"
        ><q-btn :label="`${item.name} = ${distance(item.value)}km`" @click="reset" color="primary"/></div>
      </div>
    </q-form>

  </div>
</template>

<script>
import { ref, watch, onMounted, computed } from 'vue'
// import { useRouter, useRoute } from 'vue-router'
import { date, LocalStorage } from 'quasar'
import { useStore } from 'vuex'
import axios from 'axios'
import { userData, ipDebug, crudAction, notifyAction } from 'boot/axios'
import countries from './json/countries'
import countriesStates from './json/countriesStates'
import countriesCities from './json/countriesCities'
import statesCities from './json/statesCities'
import countriesWithStates from './json/countriesWithStates'
import GoogleAutocomplete from './GoogleAutocomplete'

//
// alternative mean/average method (from https://www.30secondsofcode.org/snippet/average):
const mean = (...numbers) => numbers.reduce((acc, val) => acc + val, 0) / numbers.length
//
// usage:
mean(...[1, 2, 3]) // 2
mean(...[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) // 5
mean(...[1, 2, 3]) // 2

/**
 * Tags: CountryModule - SearchModule - ModuleDateTime - WeatherModule
 *       TagLatLng - TagApi - TagServer - TagAddLocation
 *
 * @from UserController - json
 */
export default {
  components: {
    GoogleAutocomplete // google-autocomplete
  },
  setup () {
    const $store = useStore()
    const country = ref(null)
    const Countries = ref([])
    const cities = ref([])
    const states = ref([])
    const StatesCities = ref([])
    const chooseCity = ref(null)
    const chooseStateCity = ref(null)
    const errorStr = ref(null)
    const loader = ref(false)
    const gettingLocation = ref(false)
    const advance = ref(false)
    const darkMode = ref(LocalStorage.getItem('darkMode'))

    const weather = ref(null)
    const time = ref(null)
    const temperature = ref(null)
    const offsets = ref(false)
    const localDateTime = ref(false)

    const submitResult = ref([])
    const position = ref({
      lat: userData?.latitude??userData?.lat,
      lng: userData?.longitude??userData?.lon
    })

    // [START maps_circle_simple]
    const cityMap = {
      chicago: {
        center: { lat: 41.878, lng: -87.629 },
        population: 2714856,
      },
      newyork: {
        center: { lat: 40.714, lng: -74.005 },
        population: 8405837,
      },
      losangeles: {
        center: { lat: 34.052, lng: -118.243 },
        population: 3857799,
      },
      vancouver: {
        center: { lat: 49.25, lng: -123.1 },
        population: 603502,
      },
    } // https://developers.google.com/maps/documentation/javascript/examples/circle-simple#maps_circle_simple-html

    onMounted(() => {
      initMap()
      darkModeClass(darkMode.value)
    })

    function darkModeClass(val) {
      const QDarkClass = document.querySelector('.q-dark')
      if (val==='null') val = false
      if (QDarkClass) QDarkClass.style.color = val?'#fff':'var(--q-dark)'
      if (QDarkClass) QDarkClass.style.background = val?'var(--q-dark)':'#fff'
    }

    function Cities () {
      states.value = countriesWithStates[country.value] // Country Have States
      cities.value = states.value ? countriesStates[country.value] : countriesCities[country.value]
      StatesCities.value = states.value && chooseCity.value ? statesCities[states.value][chooseCity.value] : ''
      chooseLocation() // TagRadioCity: CountryModule
    } watch([chooseStateCity, chooseCity, country], () => Cities())

    function chooseLocation () {
      const loc = chooseStateCity.value || chooseCity.value || country.value

      if (loc) {
        $store.commit('users/locationMutation', {location: loc})
        Place({place: loc.toLowerCase(), location: true}).then(res => {
          time.value = weather.value = temperature.value = null
          // console.log('chooseLocation', res)//.catch(e => notifyAction({error: 'chooseLocation', e}))
          if (res.lat) LatLng (res) // Get Lat Lng From Location
        }) // TagServer: Server Get Offset, LatLng... From Place
      } // TagSelectLocation: CountryModule
    } // TagChooseLocation: CountryModule

    function Place(loc, place) { // https://developers.google.com/maps/documentation/geocoding/overview?csw=1#ReverseGeocoding
      if (loc) return crudAction({...{url:'api/users/Place', method: 'get'}, ...loc}) // TagServer:
        .catch(e => notifyAction({error: 'chooseCityPlace', e})) // Server Get Offset, Place... From Lat Lng

      return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?key=${process.env.MAP_API_KEY}&address=${place}`).then(res => {
        // console.log('chooseLocation', res, 'res.data.error_message',res.data?.error_message || res.data?.results)
        LatLng (res.data) // TagApi: API Get Offset, LatLng... From Place
      }).catch(e => notifyAction({error: 'Place', e}))
    } // TagAddLocation: SearchModule - request: 'address', 'components', 'latlng' or 'place_id' parameter.",

    async function LatLng (data) {

      const lat = data.lat??userData.latitude??userData.lat??data.coords?.latitude
      const lng = data.lon??userData.longitude??userData.lon??data.coords?.longitude

      const res = // data.utc_offset ?? // TagServer: Server Get Offset, Place... From Lat Lng
        await Place({ lat: parseInt(lat), lon: parseInt(lng), location: true })
      if (!res.city&!data.results) Place(false, data.city) // TagApi: API Get Offset, LatLng... From Place

      const pos = [lat, lng] // Place expressed as lat,lng tuple
      position.value = {lat, lng}

      const timestamp = Date.now() // User DateTime

      const apiKey = process.env.MAP_API_KEY; loader.value = true
      let apiCall = 'https://maps.googleapis.com/maps/api/timezone/json?location=' + pos + '&timestamp=' + timestamp + '&key=' + apiKey

      offsets.value = res.utc_offset/100; if (typeof offsets.value !== undefined); else {
        const xhr = new XMLHttpRequest() // create new XMLHttpRequest object
        xhr.open('GET', apiCall) // open GET request
        xhr.onload = () => {
          if (xhr.status === 200) { // if Ajax request successful
            const output = JSON.parse(xhr.responseText) // convert returned JSON string to JSON object
            // console.log(output) // log API return status for debugging purposes
            if (output.status === 'OK') { // if API reports everything was returned successfully
              offsets.value = output.dstOffset * 1000 + output.rawOffset * 1000 // get DST and time zone offsets in milliseconds
              localDateTime.value = new Date(timestamp * 1000 + offsets.value) // Display current zone date and time
            } else notifyAction({error: output.status, e: 'output'})
          } else notifyAction({error: 'Request failed.  Returned status of ' + xhr.status, e: 'xhr'})
        }; xhr.send() // send request // Google Locale DateTime
      } const place = `${res.city||userData.city} ${(res.region||res.country)||(userData.region||userData.country)}`

      $store.commit('users/locationMutation', {location: place}); loader.value = false // TagAddLocation: LocationModule

      const formattedString = date.formatDate(zoneTime(offsets.value)||timestamp, 'HH:mm' ) // YYYY-MM-DDTHH:mm:ss.SSSZ

      time.value = localDateTime.value||formattedString // TagLocalDateTime: ModuleDateTime

      console.log(
        // 'res', res,
        // 'data', data,
        // 'chooseCity.value', chooseCity.value,
        // 'location', location,
        // 'res.place', res.place,
        'pos', pos,
        // 'LatLng', data,
        // 'userData', userData,
        // // 'utc_offset', utc_offset,
        // 'offsets.value', offsets.value,
        // 'res.utc_offset', res.utc_offset,
        // 'Date.now()', Date.now(),
      )

      apiCall = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lng + '&APPID=' + process.env.WEATHER_API_KEY

      const localeWeather = new XMLHttpRequest()
      localeWeather.open('GET', apiCall)
      localeWeather.onload = () => {
        if (localeWeather.status === 200) { // if Ajax request successful
          const output = JSON.parse(localeWeather.responseText) // convert returned JSON string to JSON object
          // console.log(output.hourly) // log API return status for debugging purposes
          const iconCode = output.current.weather[0].icon
          // const iconMain = output.current.weather[0].main
          const temp = [] // Calculate Median
          output.hourly.forEach(hourly => {
            temp.push(hourly.temp)
          })
          // Get the temperature from the API in units of Kelvin
          const temperatureKelvin = output.current.temp
          // temperatureKelvin = output.main.temp
          // Convert the temperature from Kelvin to degrees Celsius
          const temperatureCelsius = temperatureKelvin - 273.15
          // Convert the temperature from degrees Celsius to degrees Fahrenheit
          // const temperatureFahrenheit = temperatureCelsius * 1.8 + 32
          // const F = Math.round(temperatureFahrenheit)
          const C = Math.round(temperatureCelsius)
          const iconUrl = 'http://openweathermap.org/img/w/' + iconCode + '.png'

          weather.value = iconUrl
          temperature.value = C
          // Median.value = Math.round((median(temp) - 273.15) * 1.8 + 32)

        } // else notifyAction({error: 'Request failed.  Returned status of ' + localeWeather.status, e: 'localeWeather'})
      }; localeWeather.send() // TagLocaleWeather: WeatherModule
    } // TagLatLng: SearchModule

    function zoneTime(offset) {
      // create Date object for current location
      const d = new Date()

      // convert to msec
      // subtract local time zone offset
      // get UTC time in msec
      const utc = d.getTime() + (d.getTimezoneOffset() * 60000)

      // create new Date object for different city
      // using supplied offset
      const nd = new Date(utc + (3600000*offset))

      // return time as a string
      // return "The local time for city "+ city +" is "+ nd.toLocaleString()
      return nd
    } // Get Zone Time

    async function getLocation () {
      return new Promise((resolve, reject) => {
        if (!('geolocation' in navigator)) {
          reject(new Error('Geolocation is not available.'))
        } // ToImplementLocateMe
        navigator.geolocation.getCurrentPosition(pos => {
          // console.log('getCurrentPosition', pos)
          resolve(pos)
        }, err => {
          reject(err)
        })
      })
    } // TagGetLocation: SearchModule

    function initMap() {
      // Create the map.
      const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: { lat: 37.09, lng: -95.712 },
        mapTypeId: 'terrain',
      })

      // Construct the circle for each value in cityMap.
      // Note: We scale the area of the circle based on the population.
      for (const city in cityMap) {
        // Add the circle for this city to the map.
        const cityCircle = new google.maps.Circle({
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.35,
          map,
          center: cityMap[city].center,
          radius: Math.sqrt(cityMap[city].population) * 100,
        }); cityCircle
      }
    } // WorkingOn

    function distance (d) {

      // Latitude: 1 deg = 110.574 km
      // Longitude: 1 deg = 111.320*cos(latitude) km
      const lat1 = position.value?.lat - d/111
      const lat2 = position.value?.lat + d/111
      const lon1 = position.value?.lng - d/111
      const lon2 = position.value?.lng + d/111

      $store.commit('users/distanceMutation', {lat1, lat2, lon1, lon2})
      console.log({ lat1, lat2, lon1, lon2 }, 'position', position.value)
      return d
      // const R = 6378.1 // Radius of the Earth
      // const brng = 1.57 // Bearing is 90 degrees converted to radians.
      // d = 15 Distance in km

      // lat2  52.20444 - the lat result I'm hoping for
      // lon2  0.36056 - the long result I'm hoping for.

      // lat2 52.20462299620793 lon2 0.360433887489931

      // const lat1 = Math.radians(52.20472) // Current lat point converted to radians
      // const lon1 = Math.radians(0.14056) // Current long point converted to radians

      // const lat1 = toRad(52.20472) // Current lat point converted to radians
      // const lon1 = toRad(0.14056) // Current long point converted to radians

      // // let lat2 = Math.asin( Math.sin(lat1)*Math.cos(d/R) +
      // //            Math.cos(lat1)*Math.sin(d/R)*Math.cos(brng))

      // let lon2 = lon1 + Math.atan2(Math.sin(brng)*Math.sin(d/R)*Math.cos(lat1),
      //                   Math.cos(d/R)-Math.sin(lat1)*Math.sin(lat2))

      // lat2 = Math.degrees(lat2)
      // lon2 = Math.degrees(lon2)

      // lat2 = radians_to_degrees(lat2)
      // lon2 = radians_to_degrees(lon2)

      // print(lat2)
      // print(lon2)
    }

    return {
      ipDebug,
      tab: ref('current_location'),

      km: ref(50),
      submitResult,
      distance,
      onSubmit (evt) {
        const formData = new FormData(evt.target)
        const data = []

        for (const [ name, value ] of formData.entries()) {
          data.push({
            name,
            value
          })
        }

        submitResult.value = data
      },

      reset () {
        $store.commit('users/distanceMutation', {})
        submitResult.value = []
      },

      // == Location == \\
      loader,
      location: computed(() => $store.getters['users/locationGetter']),
      gettingLocation,
      errorStr,
      // results: [],
      // ===============
      advance,
      Countries,
      country,
      cities,
      StatesCities,
      chooseCity,
      chooseStateCity,

      weather,
      time,
      temperature,
      // Median,
      userData,

      role: computed(() => $store.getters['users/rolesGetter']),

      filterFn (val, update, abort) { // ===== TagChooseLocation ================= \\
        update(async () => {
          const needle = val.toLowerCase()
          const places = []

          if (advance.value) // TagAdvanceSearch: CountryModule
          try { (await Place({place: needle, search: true})).forEach(loc => places.push(loc.place)) }
          catch (e) { notifyAction({error: 'forEachFilter', e}); abort() }

          Countries.value = [...countries, ...places].filter(v => v?.toLowerCase().indexOf(needle) > -1)
          Cities()
        })
      }, // TagSelectCountry: CountryModule
      async locateMe () {
        gettingLocation.value = true
        try {
          gettingLocation.value = false
          const pos = await getLocation()
          LatLng(pos)
        } catch (e) {
          gettingLocation.value = false
          errorStr.value = e.message
        }
      }, // TagLocateMe: SearchModule

      // ======================================================================== \\

      /**
       * The "mean" is the "average" you're used to, where you add up all the numbers
       * and then divide by the number of numbers.
       *
       * For example, the "mean" of [3, 5, 4, 4, 1, 1, 2, 3] is 2.875.
       *
       * @param {Array} numbers An array of numbers.
       * @return {Number} The calculated average (or mean) value from the specified
       *     numbers.
       */
      mean (numbers) {
        let total = 0, i
        for (i = 0; i < numbers.length; i += 1) {
          total += numbers[i]
        } // Calculating the average/mean
        return total / numbers.length
      },// https://www.sitepoint.com/community/t/calculating-the-average-mean/7302/3

      /**
       * The "median" is the "middle" value in the list of numbers.
       *
       * @param {Array} numbers An array of numbers.
       * @return {Number} The calculated median value from the specified numbers.
       */
      median (numbers) {
        // median of [3, 5, 4, 4, 1, 1, 2, 3] = 3
        let median = 0, numsLen = numbers.length
        numbers.sort()

        if (
          numsLen % 2 === 0 // is even
        ) {
          // average of two middle numbers
          median = (numbers[numsLen / 2 - 1] + numbers[numsLen / 2]) / 2
        } else { // is odd
          // middle number only
          median = numbers[(numsLen - 1) / 2]
        }

        return median
      }, // NotInUse

      /**
       * The "mode" is the number that is repeated most often.
       *
       * For example, the "mode" of [3, 5, 4, 4, 1, 1, 2, 3] is [1, 3, 4].
       *
       * @param {Array} numbers An array of numbers.
       * @return {Array} The mode of the specified numbers.
       */
      mode (numbers) {
        // as result can be bimodal or multi-modal,
        // the returned result is provided as an array
        // mode of [3, 5, 4, 4, 1, 1, 2, 3] = [1, 3, 4]
        let modes = [], count = [], i, number, maxIndex = 0

        for (i = 0; i < numbers.length; i += 1) {
          number = numbers[i]
          count[number] = (count[number] || 0) + 1
          if (count[number] > maxIndex) {
            maxIndex = count[number]
          }
        }

        for (i in count) {
          if (count.hasOwnProperty(i)) {
            if (count[i] === maxIndex) {
              modes.push(Number(i))
            }
          }
        }

        return modes
      }, // NotInUse

      /**
       * The "range" of a list a numbers is the difference between the largest and
       * smallest values.
       *
       * For example, the "range" of [3, 5, 4, 4, 1, 1, 2, 3] is [1, 5].
       *
       * @param {Array} numbers An array of numbers.
       * @return {Array} The range of the specified numbers.
       */
      range (numbers) {
        numbers.sort() // return [numbers[0], numbers[numbers.length - 1]]
        return [numbers[0], numbers.at(-1)]
      } // NotInUse
    }
  }
}
</script>

<style scoped>
  .temperature:after, #temperature:after {
    content: "\2103";
  } /* https://www.htmlsymbols.xyz */
</style>
