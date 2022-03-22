<template>
  <div class="q-pa-md">

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
          <p>
            {{$t('Let us locate you for better results...')}}
            <button @click="locateMe">{{$t('Get location')}}</button>
            <!-- <q-btn color="primary"
              :loading="loader" icon="fas fa-map-pin"
              :label="$t(locationn?chooseCity:'Get location')"
              @click.prevent="locateMe" class="q-ma-sm col-lg-3"
            />TagGetLocation -->
          </p>

          <div v-if="errorStr">
            Sorry, but the following error
            occurred: {{errorStr}}
          </div>

          <div v-if="gettingLocation">
            <i>{{$t('Getting your location...')}}</i>
          </div>

          <div v-if="locationn">
            {{$t('Your location is')}} {{chooseCity}}
            <!-- , {{ locationn.coords.latitude }}, {{ locationn.coords.longitude}} -->
          </div>
        </div><!-- TagSelectCountry: CountryModule -->
      </q-tab-panel><!-- TagLocateMe: SearchModule -->

      <q-tab-panel name="choose_location">
        <div class="q-gutter-md row">
          <q-select
            filled class="col-md-6"
            v-model="country"
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            :options="countries"
            @filter="filterFn"
            hint="Basic filtering"
            style="width: 250px; padding-bottom: 32px"
          ><!-- https://quasar.dev/vue-components/select#Example--Basic-filtering -->
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No results
                </q-item-section>
              </q-item>
            </template>
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
            <div v-for="(city, key) in statesCities" :key="key">
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

  </div>
</template>

<script>
// import { env } from 'boot/axios'
import { mapGetters } from 'vuex'
import countries from './json/countries'
import countriesStates from './json/countriesStates'
import countriesCities from './json/countriesCities'
import statesCities from './json/statesCities'
import countriesWithStates from './json/countriesWithStates'
import GoogleAutocomplete from './GoogleAutocomplete'
import { userData } from 'boot/axios'

//
// alternative mean/average method (from https://www.30secondsofcode.org/snippet/average):
const mean = (...numbers) => numbers.reduce((acc, val) => acc + val, 0) / numbers.length
//
// usage:
mean(...[1, 2, 3]) // 2
mean(...[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) // 5
mean(...[1, 2, 3]) // 2

/**
 * Tags: CountryModule - SearchModule
 *
 * @from UserController - json
 */
export default {
  components: {
    GoogleAutocomplete // google-autocomplete
  },
  data () {
    return {
      tab: 'mails',
      // == Location == \\
      loader: false,
      locationn: false,
      gettingLocation: false,
      errorStr: null,
      results: [],
      // ===============
      countries: [],
      country: null,
      cities: [],
      statesCities: [],
      chooseCity: null,
      chooseStateCity: null
    }
  },
  computed: {
    ...mapGetters({
      roles: 'users/rolesGetter'
    }),
    role () {
      return this.roles
    }
  },
  watch: {
    chooseStateCity () { this.Cities() },
    chooseCity () { this.Cities() },
    country () { this.Cities() }
  },
  methods: {
    filterFn (val, update) { // ===== TagChooseLocation ================= \\
      update(() => {
        const needle = val.toLowerCase()
        this.countries = countries.filter(v => v.toLowerCase().indexOf(needle) > -1)
        this.Cities()
      })
    }, // TagSelectCountry: CountryModule
    Cities () {
      this.states = countriesWithStates[this.country] // Country Have States
      this.cities = this.states ? countriesStates[this.country] : countriesCities[this.country]
      this.statesCities = this.states && this.chooseCity ? statesCities[this.states][this.chooseCity] : ''
      this.location()
    }, // TagRadioCity: CountryModule
    location () {
      const loc = this.chooseStateCity || this.chooseCity || this.country
      if (loc) this.$store.dispatch('users/locationAction', {location: loc})
    }, // TagSelectLocation: CountryModule == TagChooseLocation End ============= \\
    async getLocation () { // =============== TagLocateMe ======================= \\
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
    }, // TagGetLocation: SearchModule
    async locateMe () {
      this.gettingLocation = true
      try {
        this.gettingLocation = false
        this.locationn = await this.getLocation()
        this.Place(this.locationn)
      } catch (e) {
        this.gettingLocation = false
        this.errorStr = e.message
      }
    }, // TagLocateMe: SearchModule
    LatLng () {
      let data = this.getLocation
      let lat = data.lat
      let lng = data.lng // TagPreferredLocation
      // if (data.lat) {
      //   let lat = data.lat
      //   let lng = data.lng // TagPreferredLocation
      // } else
      // if (data.status == google.maps.GeocoderStatus.OK) {
      //   let rep = data
      //   let lat = data.results[0].geometry.location.lat
      //   let lng = data.results[0].geometry.location.lng
      // } else alert(data.status)
      let loc = [lat, lng] // Place expressed as lat,lng tuple
      let targetDate = new Date() // Current date/time of user computer
      let timestamp = targetDate.getTime() / 1000 + targetDate.getTimezoneOffset() * 60 // Current UTC date/time expressed as seconds since midnight, January 1, 1970 UTC
      let apiKey = process.env.MAP_API_KEY
      let apiCall = 'https://maps.googleapis.com/maps/api/timezone/json?location=' + loc + '&timestamp=' + timestamp + '&key=' + apiKey
      let xhr = new XMLHttpRequest() // create new XMLHttpRequest2 object
      xhr.open('GET', apiCall) // open GET request
      xhr.onload = () => {
        if (xhr.status === 200) { // if Ajax request successful
          let output = JSON.parse(xhr.responseText) // convert returned JSON string to JSON object
          // console.log(output) // log API return status for debugging purposes
          if (output.status === 'OK') { // if API reports everything was returned successfully
            let offsets = output.dstOffset * 1000 + output.rawOffset * 1000 // get DST and time zone offsets in milliseconds
            let localDate = new Date(timestamp * 1000 + offsets) // Date object containing current time of Tokyo (timestamp + dstOffset + rawOffset)
            // console.log(localDate.toLocaleString()) // Display current Tokyo date and time
            this.localDateTime(localDate, loc)
          }
        } else alert('Request failed.  Returned status of ' + xhr.status)
      }; xhr.send() // send request

      // apiCall = 'http://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+lng+'&APPID='+'{{ env('WEATHER_API_KEY') }}'
      apiCall = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lng + '&APPID=' + process.env.WEATHER_API_KEY

      let xhr2 = new XMLHttpRequest()
      xhr2.open('GET', apiCall)

      xhr2.onload = () => {
        if (xhr2.status === 200) { // if Ajax request successful
          let output = JSON.parse(xhr2.responseText) // convert returned JSON string to JSON object
          // console.log(output.hourly) // log API return status for debugging purposes
          let iconCode = output.current.weather[0].icon
          // let iconMain = output.current.weather[0].main
          let temp = [] // Calculate Median
          output.hourly.forEach(hourly => {
            temp.push(hourly.temp)
          })
          // Get the temperature from the API in units of Kelvin
          let temperatureKelvin = output.current.temp
          // temperatureKelvin = output.main.temp

          // Convert the temperature from Kelvin to degrees Celsius
          let temperatureCelsius = temperatureKelvin - 273.15

          // Convert the temperature from degrees Celsius to degrees Fahrenheit
          let temperatureFahrenheit = temperatureCelsius * 1.8 + 32
          let F = Math.round(temperatureFahrenheit)
          let iconUrl = 'http://openweathermap.org/img/w/' + iconCode + '.png'
          document.getElementById('weather').innerHTML = `<img src="${iconUrl}"> ${F}`
          document.getElementById('temperature').value = F
          document.getElementById('median').innerHTML = Math.round((this.median(temp) - 273.15) * 1.8 + 32)
        } else alert('Request failed.  Returned status of ' + xhr2.status)
      }; xhr2.send()
    }, // NotInUse
    localDateTime (localDate) {
      let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
      // let year = localDate.getFullYear()
      // let month = localDate.getMonth() + 1
      // let day = localDate.getDate()
      let hours = localDate.getHours()
      let minutes = localDate.getMinutes()
      let seconds = localDate.getSeconds()
      let strDate = localDate.toLocaleDateString('en', options)
      let amPm = hours >= 12 ? 'pm' : 'am'
      hours = hours % 12
      hours = hours || 12 // the hour '0' should be '12'
      minutes = minutes < 10 ? '0' + minutes : minutes
      let strTime = hours + ':' + minutes + ':' + seconds + ' ' + amPm
      // let strTime = hours + ':' + minutes + ' ' + amPm
      return strDate + ' ' + strTime
      // ================================================================== \\
      // document.getElementById('time').innerHTML = strTime
      // document.getElementById('weather_id').value = output.current.weather[0].id
      // document.getElementById('localDate').value = strDate + ' ' + strTime
      // let GLat = document.getElementById('Plat').value = loc[0]
      // let GLng = document.getElementById('Plng').value = loc[1]
      // document.getElementById("region").value = place.address_components[2].long_name
    }, // TagLocalDateTime - NotInUse
    Place () {
      this.chooseCity = userData.city; this.location()
      // let loc = [parseInt(locationn.coords.latitude), parseInt(locationn.coords.longitude)]
      // this.$axios.get(`https://maps.googleapis.com/maps/api/geocode/json?key=${process.env.MAP_API_KEY}&latlng=${loc}`).then(res => {
      //   console.log('Place', res.data)
      //   this.results =  res.data.error_message || res.data.results
      // }) // https://developers.google.com/maps/documentation/geocoding/overview?csw=1#ReverseGeocoding
    }, // TagAddLocation: SearchModule - request: 'address', 'components', 'latlng' or 'place_id' parameter.",

    //
    // Calculating the average/mean
    // https://www.sitepoint.com/community/t/calculating-the-average-mean/7302/3
    //

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
      var total = 0, i
      for (i = 0; i < numbers.length; i += 1) {
        total += numbers[i]
      }
      return total / numbers.length
    },

    /**
     * The "median" is the "middle" value in the list of numbers.
     *
     * @param {Array} numbers An array of numbers.
     * @return {Number} The calculated median value from the specified numbers.
     */
    median (numbers) {
      // median of [3, 5, 4, 4, 1, 1, 2, 3] = 3
      var median = 0, numsLen = numbers.length
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
    },

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
      var modes = [], count = [], i, number, maxIndex = 0

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
    },

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
      numbers.sort()
      return [numbers[0], numbers[numbers.length - 1]]
    }
  }
}
</script>
