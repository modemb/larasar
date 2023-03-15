<template>
  <div class="q-pa-md q-dark">

    <div class="row text-center text-h6">
      <div class="col-4">{{time}}</div><!-- Time -->
      <div class="col-4" v-if="temperature">
        {{temperature}} <span id="temperature" />
      </div><!-- Weather -->
      <div class="col-4">
        <img :src="weather" floating />
      </div><!-- icon v-if="weather" -->
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
              {{location?$t('Your location is'):$t('Let us locate you for better results...')}}
            </div><!-- .toLowerCase().includes(ipData?.city.toLowerCase()) -->
            <div class="col-6">
              <q-btn class="bg-primary q-ma-sm"
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
            behavior="_dialog"
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

    <q-form @submit="onSubmit" class="q-gutter-md" v-if="location">
      <div class="q-mt-xl">
        <q-slider
          :name="$t('distance')"
          v-model="km"
          label-always
          :min="1"
          :max="1000"
          :step="1"
        />
      </div><q-badge floating label="km"/>

      <div class="row">
        <div class="col-8">
          <q-btn :label="$t('Set')" type="submit" color="primary" class="q-ma-xs"/>
          <q-btn :label="$t('Reset')" @click="reset" color="primary"/>
        </div><!-- TagSetLocation: locationModule -->
        <div v-for="(item, index) in submitResult" :key="index" class="col-4">
          <q-btn :label="`${item.name} = ${distance(item.value)}km`"/>
        </div><!-- <q-badge :label="`${item.name} = ${distance(item.value)}km`"/> -->
      </div>
    </q-form>

  </div>
</template>

<script lang="ts">
import { ref, watch, computed, onMounted, defineComponent, Ref } from 'vue'
import { date, LocalStorage } from 'quasar'
import { useStore } from 'vuex'
import axios from 'axios'
import { ipData, ipDebug } from 'boot/axios'
import { useCrudStore } from 'stores/crud'
import countries from './json/Countries.json'
import countriesStates from './json/countriesStates.json'
import countriesCities from './json/countriesCities.json'
import statesCities from './json/statesCities.json'
import countriesWithStates from './json/countriesWithStates.json'
import GoogleAutocomplete from './GoogleAutocomplete.vue'

//
// alternative mean/average method (from https://www.30secondsofcode.org/snippet/average):
const mean = (...numbers: number[]) => numbers.reduce((acc, val) => acc + val, 0) / numbers.length
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
export default defineComponent({
  components: {
    GoogleAutocomplete // google-autocomplete
  },
  setup () {
    const $store = useStore()
    const { crudAction, notifyAction } = useCrudStore()
    const country: Ref<null> = ref(null)
    const Countries: Ref<string[]> = ref([])
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
    const location = ref('')
    const position = ref({
      lat: ipData?.latitude??ipData?.lat,
      lng: ipData?.longitude??ipData?.lon
    })

    const deg2rad = (deg: number) => deg * (Math.PI/180)
    const rad2deg = (rad: number) => rad * (180/Math.PI)

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
      initMap() // WorkingOn
      darkModeClass(darkMode.value)
    })

    function darkModeClass(val: string | number | boolean | object | null) {
      const QDarkClass = document.querySelector('.q-dark')
      if (val==='null') val = false
      if (QDarkClass) QDarkClass.style.color = val?'#fff':'var(--q-dark)'
      if (QDarkClass) QDarkClass.style.background = val?'var(--q-dark)':'#fff'
    }

    function Cities() {
      states.value = countriesWithStates[country.value] // Country Have States
      cities.value = states.value ? countriesStates[country.value] : countriesCities[country.value]
      StatesCities.value = states.value && chooseCity.value ? statesCities[states.value][chooseCity.value] : ''
      chooseLocation() // TagRadioCity: CountryModule
    } watch([chooseStateCity, chooseCity, country], () => Cities())

    function chooseLocation() {
      const loc = chooseStateCity.value || chooseCity.value || country.value

      if (loc) {
        $store.commit('users/locationMutation', {location: loc})
        Place({place: loc.toLowerCase(), location: true}).then((res: { latitude: number; longitude: number }) => {
          // console.log('res', res)
          time.value = weather.value = temperature.value = null
          if (res.latitude??res.longitude)
          LatLng(res) // Get Lat Lng From Location
        }) // TagServer: Server Get Offset, LatLng... From Place
      } // TagSelectLocation: CountryModule
    } // TagChooseLocation: CountryModule

    function Place(loc: boolean | ({ method: string; url: string } & {
      url?: string | undefined; method?: string | undefined; auth_id?: number | undefined; rate?: number | undefined; result?: number | undefined; updateUser?: boolean | undefined; apiMessage?: string | undefined; from_name?: string | undefined; to_name?: string | undefined // google-autocomplete
      // google-autocomplete
      decimal_digits?: number | undefined; redirect?: string | undefined; headers?: Headers | undefined; amount?: number | undefined; from?: string | undefined; to?: string | undefined; success?: string | undefined; token?: string | undefined; update?: boolean | undefined; signature?: boolean | undefined; notify?: string | true | undefined; getUser?: boolean | undefined; position?: string; locale?: string | undefined; categoryName?: number | null | undefined; description?: null | undefined; icon?: null | undefined; categoryID?: number | undefined; subcategoryName?: number | null | undefined; id?: number | undefined; gain?: number | undefined; role?: string | undefined; name?: string | undefined; first_name?: string | undefined; last_name?: string | undefined; phone?: string | undefined; address?: string | undefined; city?: string | undefined; region?: string | undefined; postal_code?: string | undefined; country?: string | undefined; pwd?: boolean | undefined; email?: string | undefined; update_email?: boolean | undefined; password?: boolean | null | undefined; update_password?: boolean | null | undefined; new_password?: null | undefined; password_confirmation?: null | undefined; delete_avatar?: number | undefined; pending?: boolean | undefined; currenciesData?: string | undefined; flag?: string | undefined; post_id?: number | undefined; ip?: string | undefined; slug?: string | undefined; postPage?: boolean | undefined // [START maps_circle_simple]
      // [START maps_circle_simple]
      checkout?: boolean | undefined; posts?: boolean | undefined; user_id?: number | undefined; create_room?: boolean | undefined; flagState?: boolean | undefined; admin?: string | undefined; deletePic?: boolean | undefined; favorite?: boolean | undefined; pages?: number | undefined; forever?: boolean | undefined; page_title?: string | undefined; content?: string | undefined; updateSlug?: boolean | undefined; restore?: boolean | undefined; currency?: boolean | undefined; post?: boolean | undefined; rank?: number | undefined; post_archive?: boolean | undefined; authID?: number | undefined; location?: boolean | undefined; place?: string | undefined; lat?: number | undefined; lon?: number | undefined; latitude?: number | undefined; longitude?: number | undefined; utc_offset?: number | undefined
      }), place: string) { // https://developers.google.com/maps/documentation/geocoding/overview?csw=1#ReverseGeocoding

      if (loc) return crudAction({...{url:'api/users/place', method: 'get'}, ...loc}) // TagServer:
        .catch((e: string) => notifyAction({error: 'chooseCityPlace', e})) // Server Get Offset, Place... From Lat Lng

      return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?key=${process.env.MAP_API_KEY}&address=${place}`).then(res => {
        // console.log('chooseLocation', res, 'res.data.error_message',res.data?.error_message || res.data?.results)
        LatLng(res.data) // TagApi: API Get Offset, LatLng... From Place
      }).catch(e => notifyAction({error: 'Place', e}))
    } // TagAddLocation: SearchModule - request: 'address', 'components', 'latlng' or 'place_id' parameter.",

    async function LatLng(data: {[x: string]:  {[x: string]: unknown}}) { //

      const lat = data.coords?.latitude // TagLocateMe: Get Lat From GPS
               ?? data.latitude // TagServer: Get Lat... From DB
               ?? ipData.latitude // Get Lat From Analytic
               ?? ipData.lat // Get Lat From Analytic
      const lng = data.coords?.longitude // TagLocateMe: Get Lng From GPS
               ?? data.longitude // TagServer: Get Lng... From DB
               ?? ipData.longitude // Get Lng From Analytic
               ?? ipData.lon // Get Lng From Analytic

      const res = await Place({ lat, lng }) // TagServer: geolocationModule - Server Get Location (Offset, Place) From DB
      if (!res?.city&&!data?.results) Place(false, data.city) // TagApi: API Get Location (Offset, LatLng) From Google

      const pos = [lat, lng] // Place expressed as lat,lng tuple
      position.value = {lat, lng} // https://www.latlong.net

      const timestamp = Date.now() // User DateTime

      const apiKey = process.env.MAP_API_KEY; loader.value = true
      let apiCall = 'https://maps.googleapis.com/maps/api/timezone/json?location=' + pos + '&timestamp=' + timestamp + '&key=' + apiKey

      offsets.value = res?.utc_offset/100; if (typeof offsets.value !== undefined)''; else {
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
      } location.value = `${res?.city||ipData?.city} ${(res?.region||res?.country)||(ipData?.region||ipData?.country)}`

      $store.commit('users/locationMutation', { location:location.value }); loader.value = false // TagAddLocation: LocationModule

      const formattedString = date.formatDate(zoneTime(offsets.value)||timestamp, 'HH:mm' ) // YYYY-MM-DDTHH:mm:ss.SSSZ

      time.value = localDateTime.value||formattedString // TagLocalDateTime: ModuleDateTime

      console.log(
        // 'res', res,
        // 'chooseCity.value', chooseCity.value,
        // 'location', location,
        // 'res.place', res.place,
        // 'pos', pos,
        // 'lat', lat,
        // 'lng', lng,
        // 'LatLng', data,
        // 'ipData', ipData,
        // 'utc_offset', utc_offset,
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
          output.hourly.forEach((hourly: { temp: number }) => {
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

        } else notifyAction({error: 'Request failed.  Returned status of ' + localeWeather.status, e: 'localeWeather'})
      }; localeWeather.send() // TagLocaleWeather: WeatherModule
    } // TagLatLng: SearchModule

    function zoneTime(offset: number | boolean) {
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

    async function getLocation() {
      return new Promise((resolve, reject) => {
        if (!('geolocation' in navigator)) {
          reject(new Error('Geolocation is not available.'))
        } // TagLocateMe: geolocationModule
        navigator.geolocation.getCurrentPosition(pos => {
          resolve(pos) // console.log('getCurrentPosition', pos)
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

    function distance(d: number) {
      const R = 6371 // Radius of the Earth | d: Distance in km
      const brng = deg2rad(45) // Bearing degrees to radians.
      const lat = deg2rad(position.value?.lat) // Current lat point converted to radians
      const lon = deg2rad(position.value?.lng) // Current long point converted to radians

      let lat1 = Math.asin( Math.sin(lat)*Math.cos(-d/R) +
                 Math.cos(lat)*Math.sin(-d/R)*Math.cos(brng))
      let lon1 = Math.atan2(Math.sin(brng)*Math.sin(-d/R)*Math.cos(lat),
                 Math.cos(-d/R)-Math.sin(lat)*Math.sin(lat1)) + lon
      let lat2 = Math.asin( Math.sin(lat)*Math.cos(d/R) +
                 Math.cos(lat)*Math.sin(d/R)*Math.cos(brng))
      let lon2 = Math.atan2(Math.sin(brng)*Math.sin(d/R)*Math.cos(lat),
                 Math.cos(d/R)-Math.sin(lat)*Math.sin(lat2)) + lon

      lat1 = rad2deg(lat1); lon1 = rad2deg(lon1); lat2 = rad2deg(lat2); lon2 = rad2deg(lon2)

      $store.commit('users/distanceMutation', { lat1, lat2, lon1, lon2 })

      return d // https://www.geodatasource.com/developers/javascript

      console.log(
        { lat1, lat2, lon1, lon2, brng, d, position},
        getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2)
      ) // print(lat2); // print(lon2)
    } // Get The Distance (Rayon) From The Middle To The Circle

    function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
      const R = 6371 // Radius of the earth in km
      const dLat = deg2rad(lat2-lat1)  // deg2rad below
      const dLon = deg2rad(lon2-lon1)

      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                Math.sin(dLon/2) * Math.sin(dLon/2)

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
      const d = R * c; /* Distance in km */ return d
    } // Get Distance From Latitude Longitude In Kilometer

    return {
      ipDebug,
      tab: ref('current_location'),

      km: ref(50),
      submitResult,
      distance,
      onSubmit (evt: { target: HTMLFormElement | undefined }) {
        const formData = new FormData(evt.target)
        const data = []; crudAction({ position, mutate: 'position' })

        for (const [ name, value ] of formData.entries()) {
          data.push({ name, value })
        } submitResult.value = data
      },

      reset () {
        $store.commit('users/distanceMutation', {})
        submitResult.value = []
      },

      // == Location == \\
      loader,
      position,
      location, //: computed(() => $store.getters['users/locationGetter']),
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
      ipData,

      role: computed(() => $store.getters['users/rolesGetter']),

      filterFn (val: string, update: (arg0: () => Promise<void>) => void, abort: () => void) { // ===== TagChooseLocation ================= \\
        update(async () => {
          const needle = val.toLowerCase()
          const places: string[] = []

          if (needle&&advance.value) // TagAdvanceSearch: CountryModule
          try { (await Place({place: needle, search: true})).forEach((loc: { place: string }) => places.push(loc.place)) }
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
          LatLng(pos) // Get LatLng From GPS
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
      mean (numbers: number[]) {
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
      median (numbers: number[]) {
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
      mode (numbers: number[]) {
        // as result can be bimodal or multi-modal,
        // the returned result is provided as an array
        // mode of [3, 5, 4, 4, 1, 1, 2, 3] = [1, 3, 4]
        let modes = [], count: number[] = [], i, number, maxIndex = 0

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
      range (numbers: number[]) {
        numbers.sort() // return [numbers[0], numbers[numbers.length - 1]]
        return [numbers[0], numbers.at(-1)]
      } // NotInUse
    }
  }
})
</script>

<style scoped>
  .temperature:after, #temperature:after {
    content: "\2103";
  } /* https://www.htmlsymbols.xyz */
</style>
