<template>
  <div>
    <div
      class="google-map"
      ref="googleMap"
    ></div>
    <template v-if="Boolean(this.google) && Boolean(this.map)">
      <slot
        :google="google"
        :map="map"
      />
    </template>
  </div>
</template>

<script>
// import GoogleMapsApiLoader from 'google-maps-api-loader'
// var GoogleMapsApiLoader = require('google-maps-api-loader')

export default {
  props: {
    mapConfig: Object,
    apiKey: String
  },

  data () {
    return {
      google: null,
      map: null
    }
  },

  async mounted () {
    const googleMapApi = await GoogleMapsApiLoader({
      // apiKey: this.apiKey = process.env.MAP_API_KEY
    })
    this.google = googleMapApi
    this.initializeMap()
    // GoogleMapsApiLoader({
    //   libraries: ['places'],
    //   apiKey: env.MAP_API_KEY // 'your-api-key' // optional
    // }).then(googleApi => {
    //   this.autocomplete = new googleApi.maps.places.AutocompleteService()
    //   console.log('autocomplete', this.autocomplete)
    // }).catch(err => {
    //   console.error(err)
    // }) // TagAddLocation: SearchModule
  },

  methods: {
    initializeMap () {
      const mapContainer = this.$refs.googleMap
      this.map = new this.google.maps.Map(mapContainer, this.mapConfig)
    }
  }
}
</script>

<style scoped>
.google-map {
  width: 100%;
  min-height: 100%;
}
</style>
