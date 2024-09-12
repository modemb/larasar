<template>
  <div class="q-pa-md _q-dark">

    <div class="row text-center text-h6"> {{ location }}
      <div class="col-4">{{time}}</div><!-- Time -->
      <div class="col-4" v-if="weather?.C">
        {{weather?.C}} <span id="temperature" />
      </div><!-- Weather -->
      <div class="col-4" v-if="weather?.iconUrl">
        <img :src="weather?.iconUrl" floating />
      </div><!-- icon -->
      <div id="map"></div>
    </div><!-- WeatherModule -->

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
      <q-tab name="add_location" icon="maps_ugc" :label="$t('add_location')" v-if="auth?.role==='Admin'" />
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
              <q-btn color="primary" class="q-ma-sm"
                :loading="loader" icon="fas fa-map-pin"
                :label="$t(location||'Get location')"
                @click.prevent="locateMe" dense
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
            _transition-show="flip-up"
            _transition-hide="flip-down"
            _behavior="dialog"
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

            <!--<q-btn @click="advance=!advance"
              :color="advance?'negative':'grey'"
              :icon="advance?'fab fa-searchengin':'fas fa-search'"
            /> TagAdvanceSearch: CountryModule -->

            <q-btn dense flat
              icon="fas fa-search"
              @click="advance=!advance"
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

    <q-form @submit="onSubmit" class="q-gutter-md" v-if="location"><!-- v-if="distance" -->
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
          <!-- <q-btn :label="$t(distance?'Set':'Reset')" type="submit" :class="(distance?'bg-red':'bg-grey')+' q-ma-xs'"/> -->
          <q-btn :label="$t('Set')" type="submit" :color="distance?'red':'grey'" class="q-ma-xs"/>
          <q-btn :label="$t('Reset')" @click="reset" color="primary"/>
        </div><!-- TagSetLocation: locationModule -->
        <div v-for="(item, index) in submitResult" :key="index" class="col-4">
          <q-btn :label="`${item.name} = ${item.value}km`"/>
          <!-- <q-btn :label="`${item.name} = ${radius(item.value)}km`"/> -->
        </div><!-- <q-badge :label="`${item.name} = ${radius(item.value)}km`"/> -->
      </div>
    </q-form><!-- distanceModule -->

  </div>
</template>

<script lang="ts" setup>
import { Cookies } from 'quasar'
import { ref, watch, computed, onMounted } from 'vue'
import { date } from 'quasar'
import { capacitor } from './Functions'
import { ipData, locationMutation, mSession } from 'boot/axios'
import { useCrudStore } from 'stores/crud'
import axios from 'axios'
import countries from './json/Countries.json'
import countriesStates from './json/countriesStates.json'
import countriesCities from './json/countriesCities.json'
import statesCities from './json/statesCities.json'
import countriesWithStates from './json/countriesWithStates.json'
import GoogleAutocomplete from './GoogleAutocomplete.vue'

// alternative mean/average method (from https://www.30secondsofcode.org/snippet/average):
// const mean = (...numbers: number[]) => numbers.reduce((acc, val) => acc + val, 0) / numbers.length
// usage:
// mean(...[1, 2, 3]) // 2
// mean(...[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) // 5
// mean(...[1, 2, 3]) // 2

/**
 * Tags: CountryModule - SearchModule - DateTimeModule - WeatherModule
 *       geolocationLocationModule - distanceModule - PositionModule
 *       TagLatLng - TagApi - TagServer - TagAddLocation - TagLocateMe
 *       TagPosition
 *
 * @to UserController - json
 */
// export default defineComponent({
  // components: {
  //   GoogleAutocomplete // google-autocomplete
  // },
  // setup () {
    const $store = useCrudStore()
    const { crudAction, notifyAction } = $store
    const country = ref<string>('')
    const Countries = ref<string[]>([])
    const cities = ref<string[]>([])
    const states = ref<string>('')
    const StatesCities = ref<string[]>([])
    const chooseCity = ref('')
    const chooseStateCity = ref('')
    const errorStr = ref('')
    const loader = ref(false)
    const gettingLocation = ref(false)
    const advance = ref(true)
    const weatherGetter = ref<string>(Cookies.get('weatherGetter'))
    const time = ref(date.formatDate(Number(Cookies.get('timezone'))||'', 'HH:mm'))
    const offsets = ref(0)
    const localDateTime = ref<any>(false)
    const submitResult = ref<any[]>([])
    const tab = ref('current_location')


    const weather = computed(() => $store[weatherGetter.value]?.weather)
    const distance = computed(() => $store.distanceGetter?.distance)
    const location = computed(() => $store.locationGetter?.location)
    const position = computed(() => $store.positionGetter?.position)
    const positionSaved = computed(() => Cookies.get('position'))
    const weatherSaved = computed(() => Cookies.get('weather'))
    const auth = computed(() => $store.authGetter)

    const km = computed(() => distance.value?.d||50) // distanceModule
    // const km = ref(distance.value?.d||50) // distanceModule

    const deg2rad = (deg: number) => deg * (Math.PI/180)
    const rad2deg = (rad: number) => rad * (180/Math.PI)

    // [START maps_circle_simple]
    const cityMap = {
      chicago: {
        center: { lat: 41.878, lon: -87.629 },
        population: 2714856,
      },
      newyork: {
        center: { lat: 40.714, lon: -74.005 },
        population: 8405837,
      },
      losangeles: {
        center: { lat: 34.052, lon: -118.243 },
        population: 3857799,
      },
      vancouver: {
        center: { lat: 49.25, lon: -123.1 },
        population: 603502,
      },
    } // https://developers.google.com/maps/documentation/javascript/examples/circle-simple#maps_circle_simple-html

    // onMounted(() => initMap()) // WorkingOn
    onMounted(() => weatherMutation(weatherSaved.value)) // WeatherModule

    function Cities() {
      states.value = countriesWithStates[country.value] // Country Have States
      cities.value = states.value ? countriesStates[country.value] : countriesCities[country.value]
      StatesCities.value = states.value && chooseCity.value ? statesCities[states.value][chooseCity.value] : ''
      chooseLocation() // TagRadioCity: CountryModule
    } watch([chooseStateCity, chooseCity, country], () => Cities())

    function chooseLocation() {
      const loc = chooseStateCity.value || chooseCity.value || country.value; if (loc) {
        const mutate = 'placeGetter' + loc; locationMutation(loc)
        Place({place: loc.toLowerCase(), mutate, location: true}, '').then(data => {
            weatherGetter.value = time.value = '' // weatherIcon.value = ''; temperature.value = 0
            if (data?.latitude??data?.longitude) LatLng(data) // Get Lat Lng From Location
            else { // Location Not Available
              positionMutation(null) /* Reset Position */
              weatherMutation(''); Cookies.remove('timezone')
            } console.log('chooseLocation', data)
        }) // TagServer: Server Get Offset, LatLng... From Place
      } // TagSelectLocation: CountryModule
    } // TagChooseLocation: CountryModule

    function Place(params: any, place: string) { // https://developers.google.com/maps/documentation/geocoding/overview?csw=1#ReverseGeocoding

      if (params) return crudAction({url:'api/users/place', method: 'get', ...params}) // TagServer:
        .catch((e: unknown) => notifyAction({error: 'chooseCityPlace', e})) // Server Get Offset, Place... From Lat Lng

      return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?key=${process.env.MAP_API_KEY}&address=${place}`).then(({ data }) => {
        // console.log('chooseLocation', data, 'data.error_message', data?.error_message || data?.results)
        LatLng(data) // TagApi: API Get Offset, LatLng... From Place
      }).catch(e => notifyAction({error: 'Place', e}))
    } // TagAddLocation: SearchModule - request: 'address', 'components', 'latlng' or 'place_id' parameter.",

    async function LatLng(params: any) {

      const lat = params?.coords?.latitude // TagLocateMe: Get Lat From GPS
               ?? params?.latitude // TagServer: Get Lat... From DB Or Google API
               ?? params?.lat // TagServer: positionGetter
               ?? ipData?.latitude // Get Lat From Analytic
               ?? ipData?.lat // Get Lat From Analytic
      const lon = params?.coords?.longitude // TagLocateMe: Get Lng From GPS
               ?? params?.longitude // TagServer: Get Lng... From DB Or Google API
               ?? params?.lon // TagServer: positionGetter
               ?? ipData?.longitude // Get Lng From Analytic
               ?? ipData?.lon // Get Lng From Analytic

      const utc_offset =  params?.offsets // Update  Utc Offset From GPS
      const mutate = 'placeGetter' + lat + lon
      const payload = { lat, lon, utc_offset, mutate }
      const data = await Place(payload, '') // TagServer: geolocationLocationModule - Server Get Location (Offset, Place) From DB

      if (!data?.city&&!params?.results) Place(false, params.city) // TagApi: API Get Location (Offset, LatLng) From Google
      else crudAction({ data, mutate: 'placeGetter', refresh: ['placeGetter'] })  // TagServer: GetterMutation

      const pos = [lat, lon] // Place expressed as lat,lon tuple
      const timestamp = Date.now() // User DateTime
      const apiKey = process.env.MAP_API_KEY

      let apiCall = 'https://maps.googleapis.com/maps/api/timezone/json?location=' + pos + '&timestamp=' + timestamp + '&key=' + apiKey

      offsets.value = utc_offset??(data?.utc_offset/100); if (typeof offsets.value !== undefined)''; else {
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
        }; loader.value = true; xhr.send() // send request // Google Locale DateTime
      } // Get Locale DateTime From Google Api

      locationMutation(`${data?.city||ipData?.city} ${(data?.region||data?.country)||(ipData?.region||ipData?.country)}`)
      positionMutation({ lat, lon /* utc_offset: offsets.value */ }); loader.value = false // ^^^ TagAddLocation: LocationModule

      const formattedString = date.formatDate(timezone(offsets.value)||timestamp, 'HH:mm' ) // YYYY-MM-DDTHH:mm:ss.SSSZ

      time.value = localDateTime.value||formattedString // TagLocalDateTime: DateTimeModule
      weatherGetter.value = 'weatherGetter' + lat + lon

      console.log(
        // 'LatLng', params,
        // 'data/place', data,
        // 'position', position.value,
        // 'location', location.value,
        // 'lat', lat,
        // 'lon', lon,
        // 'weatherSaved', weatherSaved,
        // 'weatherGetter', weatherGetter.value,
        // 'chooseCity.value', chooseCity.value,
        // 'data.place', data.place,
        // 'pos', pos,
        // timezone(offsets.value)
        // 'ipData', ipData,
        // 'utc_offset', utc_offset,
        // 'offsets.value', offsets.value,
        // 'data.utc_offset', data.utc_offset,
        // 'Date.now()', Date.now(),
      )

      if (weatherSaved.value?.G === weatherGetter.value) return weatherMutation(weatherSaved.value) // WeatherModule

      apiCall = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&APPID=' + process.env.WEATHER_API_KEY

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
          const temperatureFahrenheit = temperatureCelsius * 1.8 + 32
          const F = Math.round(temperatureFahrenheit)
          const C = Math.round(temperatureCelsius)
          const iconUrl = 'https://openweathermap.org/img/w/' + iconCode + '.png'

          // Median.value = Math.round((median(temp) - 273.15) * 1.8 + 32)

          // weatherIcon.value = iconUrl
          // temperature.value = C

          weatherMutation({C, F, iconUrl, G: weatherGetter.value })

        } else notifyAction({error: 'Request failed.  Returned status of ' + localeWeather.status, e: 'localeWeather'})
      }; localeWeather.send() // TagLocaleWeather: WeatherModule
    } // TagLatLng: SearchModule - https://www.latlong.net

    async function locateMe() {
      gettingLocation.value = true; try {
        const pos = await getLocation()
        pos.offsets = Offset()
        // console.log('pos', pos)
        LatLng(pos) // Get LatLng From GPS
        gettingLocation.value = false
      } catch (e: any) {
        gettingLocation.value = false
        errorStr.value = e.message
      } // geolocationLocationModule
    } // TagLocateMe: SearchModule

    function Offset() {
      const d = new Date()
      const offset = d.getTimezoneOffset()

      // console.log('Date', d.getUTCDate())
      // console.log('Day', d.getUTCDay())
      // console.log('Year', d.getUTCFullYear())
      // console.log('Hours', d.getUTCHours())
      // console.log('Milliseconds', d.getUTCMilliseconds())
      // console.log('Minutes', d.getUTCMinutes())
      // console.log('Month', d.getUTCMonth())
      // console.log('Seconds', d.getUTCSeconds())

      return -offset/60 // UTC Offset
    } // Get UTC Offset

    function timezone(offset: number) {
      // create Date object for current location
      const d = new Date()

      // convert to msec
      // subtract local time zone offset
      // get UTC time in msec
      const utc = d.getTime() + (d.getTimezoneOffset() * 60000)
      const timezone = utc + (3600000*offset) // console.log('timezone', timezone)

      // Date for different city using supplied offset
      const nd = new Date(timezone)
      Cookies.set('timezone', JSON.stringify(timezone), { expires: '1h' })

      // toNormalTime(nd) // Normal Time

      // return time as a string
      // return "The local time for city "+ city +" is "+ nd.toLocaleString()
      return nd.toLocaleString() // Military Time
    } // Get Zone Time - setInterval(myTimer, 1000);

    function toNormalTime(date: { getHours: () => number; getMinutes: () => { (): any; new(): any; toString: { (): string; new(): any } } }) {
      let hours = date.getHours()
      const minutes = date.getMinutes().toString().padStart(2, '0')
      const period = hours >= 12 ? 'PM' : 'AM'

      // Convert hours from 24-hour to 12-hour format
      hours = hours % 12 || 12 // Convert '0' to '12' for midnight and '13-23' to '1-11' for PM

      return `${hours}:${minutes} ${period}`
      console.log('toNormalTime', `${hours}:${minutes} ${period}`)
    } // Helper function to convert time to 12-hour format

    async function getLocation() {

      mSession(['categoriesGetter'])

      if (capacitor()?.Geolocation) return capacitor()?.Geolocation?.getCurrentPosition()
      else return new Promise((resolve, reject) => {
        if (!('geolocation' in navigator)) {
          reject(new Error('Geolocation is not available.'))
        } // TagLocateMe: geolocationLocationModule
        navigator.geolocation.getCurrentPosition(pos => {
          resolve(pos) // console.log('getCurrentPosition', pos)
        }, err => {
          reject(err)
        })
      })
    } // TagGetLocation: SearchModule

    function distanceMutation(distance: null | {d?: number; lat1?: number; lat2?: number; lon1?: number; lon2?: number }) {
      crudAction({distance, mutate: 'distanceGetter', refresh: ['distanceGetter']}) // Cookies.set('distance', distance, { expires: '365' })
    } // distanceModule // Radius Distance Mutation

    function positionMutation(position: { lat: number; lon: number } | null) {

      crudAction({ position, mutate: 'positionGetter', refresh: ['positionGetter'] })
        .then(() => Cookies.set('position', JSON.stringify(position), { expires: 365 }))

    } // Position Mutation - Get Latitude And Long

    function weatherMutation(weather: { C: number; F: number; iconUrl: string; G: string } | any) {

      // if (weather)
      Cookies.set('weather', JSON.stringify(weather), { expires: '1h' })
      // if (weatherGetter.value)
      Cookies.set('weatherGetter', weatherGetter.value, { expires: '1h' })
      crudAction({ weather, mutate: weatherGetter.value })

    } // TagWeatherMutation: WeatherModule

    function radius(d: number) {
      const R = 6371 // Radius of the Earth | d: Distance in km
      const bearing = deg2rad(45) // Bearing degrees to radians.
      const lat = deg2rad(position.value?.lat) // Current lat point converted to radians
      const lon = deg2rad(position.value?.lon) // Current long point converted to radians

      let lat1 = Math.asin(Math.sin(lat)*Math.cos(-d/R) +
                 Math.cos(lat)*Math.sin(-d/R)*Math.cos(bearing))
      let lon1 = Math.atan2(Math.sin(bearing)*Math.sin(-d/R)*Math.cos(lat),
                 Math.cos(-d/R)-Math.sin(lat)*Math.sin(lat1)) + lon
      let lat2 = Math.asin(Math.sin(lat)*Math.cos(d/R) +
                 Math.cos(lat)*Math.sin(d/R)*Math.cos(bearing))
      let lon2 = Math.atan2(Math.sin(bearing)*Math.sin(d/R)*Math.cos(lat),
                 Math.cos(d/R)-Math.sin(lat)*Math.sin(lat2)) + lon

      lat1 = rad2deg(lat1); lon1 = rad2deg(lon1); lat2 = rad2deg(lat2); lon2 = rad2deg(lon2)

      distanceMutation({d, lat1, lat2, lon1, lon2})

      // console.log('distance',
      //   { lat1, lat2, lon1, lon2, bearing, d, position },
      //   getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2)
      // ) // print(lat2); // print(lon2)

      return d // https://www.geodatasource.com/developers/javascript
    } // distanceModule - Get The Distance (Rayon) From The Middle To The Circle

    function onSubmit (evt: { target: HTMLFormElement | any }) {
      const formData: any = new FormData(evt.target)
      const data = []

      if (typeof positionSaved.value === 'object') LatLng(positionSaved.value)

      // crudAction({ position, mutate: 'positionGetter', refresh: ['positionGetter'] })

      for (const [ name, value ] of formData.entries()) {
        data.push({ name, value }); // console.log('data', data)
      } radius(data[0].value); submitResult.value = data
    } // TagPosition: PositionModule - distanceModule

    function reset () {
      distanceMutation(null)
      submitResult.value = []
    }

    function filterFn (val: string, update: (arg0: () => Promise<void>) => void, abort: () => void) { // ===== TagChooseLocation ================= \\
      update(async () => {
        const needle = val.toLowerCase(); mSession(['categoriesGetter'])
        const mutate = 'placeGetter' + needle
        const places: string[] = []; console.log('mutate', mutate)

        if (needle/* &&advance.value */) try { // TagAdvanceSearch: CountryModule
          const data = await Place({place: needle, mutate, search: true}, '')
          data.forEach((loc: { place: string }) => places.push(loc.place)) }
        catch (e) { notifyAction({error: 'forEachFilter', e}); abort() }

        Countries.value = [...countries, ...places].filter(v => v?.toLowerCase().indexOf(needle) > -1)
        Cities()
      })
    } // TagSelectCountry: CountryModule

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

    function initMap() {
      // Create the map.
      const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: { lat: 37.09, lon: -95.712 },
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
    function mean (numbers: number[]) {
      let total = 0, i
      for (i = 0; i < numbers.length; i += 1) {
        total += numbers[i]
      } // Calculating the average/mean
      return total / numbers.length
    } // https://www.sitepoint.com/community/t/calculating-the-average-mean/7302/3

    /**
     * The "median" is the "middle" value in the list of numbers.
     *
     * @param {Array} numbers An array of numbers.
     * @return {Number} The calculated median value from the specified numbers.
     */
    function median (numbers: number[]) {
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
    } // NotInUse

    /**
     * The "mode" is the number that is repeated most often.
     *
     * For example, the "mode" of [3, 5, 4, 4, 1, 1, 2, 3] is [1, 3, 4].
     *
     * @param {Array} numbers An array of numbers.
     * @return {Array} The mode of the specified numbers.
     */
    function mode (numbers: number[]) {
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
    } // NotInUse

    /**
     * The "range" of a list a numbers is the difference between the largest and
     * smallest values.
     *
     * For example, the "range" of [3, 5, 4, 4, 1, 1, 2, 3] is [1, 5].
     *
     * @param {Array} numbers An array of numbers.
     * @return {Array} The range of the specified numbers.
     */
    function range (numbers: number[]) {
      numbers.sort() // return [numbers[0], numbers[numbers.length - 1]]
      return [numbers[0], numbers.at(-1)]
    } // NotInUse
</script>

<style scoped>
  .temperature:after, #temperature:after {
    content: "\2103";
  } /* https://www.htmlsymbols.xyz */
</style>
