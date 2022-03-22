<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Weather Dashboard</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link href="{{ asset('css/app.css') }}" rel="stylesheet" type="text/css">
    <style>
        .weather:after, #weather:after {
            content: "\00b0";
        }
    </style>

<body>

    <div id="*app">
        <weather-dashboard-card>
            <!-- Content -->
            <div class="container mt-3">
                    @if (session('status'))
                        <div class="help-block text-center">
                            <strong>{{ session('status') }}</strong>
                        </div>
                    @endif
                    <div class="row alert alert-primary">

                        <!-- Logo -->
                        <div id="logo" class="col-md-3 pt-3">
                            <a class="navbar-brand" href="{{url('/')}}">My Weather dashboard</a>
                        </div>

                        <div class="col-md-3 pt-2">
                            <h4><i class="fas fa-map-pin fa-2x pr-2"></i><span id="location"></span></h4>
                        </div><!-- location -->

                        <div class="col-md-3 pt-2">
                            <!-- Time -->
                            <span id="time"></span>
                            <!-- Weather -->
                            <span id="weather"></span>F
                        </div>

                        <span id="change_location" class="col-md-3 pt-3">
                            <form class="input-group addLocation mb-3" method="POST" action="{{ url('posts') }}">
                                @csrf <input type="hidden" name="temperature" id="temperature">
                                <input type="hidden" name="localDateTime" id="localDateTime">
                                <input type="hidden" name="weather_id" id="weather_id">
                                {{-- <input type="hidden" name="region" id="region"> --}}
                                <input  type="search" class="form-control" id="autocomplete-input" name="location" placeholder="Add Location">
                                <a class="btn btn-outline-secondary" onclick="clicked('.addLocation')">Add</a>
                            </form>{{-- TagPostLocation: WeatherModule --}}
                            @if ($errors->has('location'))
                                <strong>The location field.</strong>
                            @endif
                        </span>
                    </div>
                    <form class="col-md-12 alert alert-success pt-2" method="POST" action="{{ url('posts', 'all') }}">
                        @method('DELETE') @csrf {{-- TagDeleteAll: WeatherModule --}}
                        <span class="col-md-6">
                            <button>Delete all</button> weather data
                        </span>
                    </form>
                    <form class="col-md-12 alert alert-success pt-2" method="POST" action="{{ url('posts', 'range') }}">
                        @method('DELETE') @csrf {{-- TagDeleteRange: WeatherModule --}}
                        location <input type="text" name="location">
                        Start <input type="date" name="start">
                        End <input type="date" name="end">
                        <span class="col-md-6">
                            <button>Delete range</button>
                        </span>
                    </form>
                    <form class="col-md-12 alert alert-success pt-2" method="GET" action="{{ url('posts', 'lo_hi') }}">
                        <span class="col-md-6">{{-- TagRangeShow: WeatherModule --}}
                            Start <input type="date" name="start">
                            End <input type="date" name="end">
                            <button>Get lowest and highest</button> weather data
                        </span>
                    </form>
                    <form class="col-md-12 alert alert-success pt-2" method="GET" action="{{ url('posts', 'id') }}">
                        <span class="col-md-6">{{-- TagShowByID: WeatherModule --}}
                            <button>Show all</button> weather data by id
                        </span>
                    </form>
                    <form class="col-md-12 alert alert-success pt-2" method="GET" action="{{ url('posts', 'location') }}">
                        <span class="col-md-6">{{-- TagShowByLocation: WeatherModule --}}
                            <button>Show all</button> weather data by location
                        </span>
                    </form>
                    <div class="col-md-12 alert alert-success pt-2">
                        <form method="GET" class="calDistance" action="{{ url('posts', 'distance') }}">
                            <input type="hidden" name="Plat" id="Plat">
                            <input type="hidden" name="Plng" id="Plng">{{-- TagPreferredLocation: WeatherModule --}}
                            <a class="btn btn-outline-secondary" onclick="getLocation()">Get</a>
                            <input type="text" name="preferredLocation" id="preferredLocation" placeholder="Preferred Location">
                            <input  type="text" name="givenLocation" placeholder="Given Location">
                            <button class="btn btn-outline-secondary">Calculate</button>
                            @if (isset($preferredLocation) & isset($location))
                                {{$preferredLocation}} to {{$location}} <span id="d"></span>km
                            @endif
                        </form>{{-- TagCalculateDistance: WeatherModule --}}
                        @if ($errors->has('givenLocation'))
                            <strong>The location field.</strong>
                        @endif
                    </div>
                    @foreach (isset($orderBy)?$orderBy:DB::table('weathers')->get() as $weather)
                        <div class="col-md-12 alert alert-success pt-2">
                            <span class="col-md-6">
                                {{$weather->location}} {{$weather->temperature}}<span class="weather"></span>F {{$weather->date}}
                            </span>
                            <span class="col-md-6">
                                <button onclick="destroy({{$weather->id}})"> Delete</button>
                            </span>{{-- TagDeleteByID: WeatherModule --}}
                            <span class="col-md-6">
                                <button onclick="update({{$weather->id}}, '{{$weather->location}}')"> Update</button>
                            </span>{{-- TagUpdateByID: WeatherModule --}}
                        </div>
                    @endforeach {{-- TagShow: WeatherModule --}}
            </div>


        </weather-dashboard-card>
    </div>

    <script type="text/javascript" src="{{ asset('js/app.js') }}"></script>
    <script type="text/javascript" src="{{asset('js/skycons.js')}}"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/js/all.min.js"></script>
    <script async defer src="https://maps.googleapis.com/maps/api/js?key={{ env('MAP_API_KEY') }}&callback=initMap"></script>

    <script>

        $('#location').html('{{$location}}'); Place()

        function destroy (id) {
            $('#change_location').html(`
                <form id="deleteLocation" method="POST" action="{{ url('posts/${id}') }}">
                    @method('DELETE') @csrf
                </form>`
            );  $('#deleteLocation').submit()
        }   // TagDeleteByID: WeatherModule

        function update (id, location) {
            $('#change_location').html(`
                <form id="updateLocation" method="POST" action="{{ url('posts/${id}') }}">
                    @method('PUT') @csrf <input type="hidden" name="temperature" id="temperature">
                    <input type="hidden" name="location" id="autocomplete-input" value="${location}">
                    <input type="hidden" name="localDateTime" id="localDateTime">
                    <input type="hidden" name="weather_id" id="weather_id">
                </form>`
            );  clicked('#updateLocation')
        }   // TagUpdateByID: WeatherModule

        function clicked(cl) {
            Place(); setInterval(() => { $(cl).submit() }, 500)
        }

        function Place() {
            let place = document.getElementById('autocomplete-input').value || '{{$location}}';
            $.get('https://maps.googleapis.com/maps/api/geocode/json?key={{ env('MAP_API_KEY') }}', {address: place}, data => {
                LatLng(data)
            });
        }   // TagPlace: WeatherModule


        function getLocation() {//=================TagPreferredLocation===========================
            if (navigator.geolocation) navigator.geolocation.getCurrentPosition(showPosition)
            else alert("Geolocation is not supported by this browser.")
        }   // TagPreferredLocation: WeatherModule

        function showPosition(position) {
            var lat = position.coords.latitude
            var lng = position.coords.longitude
            var latlng = new google.maps.LatLng(lat, lng)
            var geocoder = geocoder = new google.maps.Geocoder()
            geocoder.geocode({ 'latLng': latlng }, (results, status) => {
                document.getElementById("preferredLocation").value = results[1].address_components[1].long_name
                LatLng({lat: lat, lng: lng})
                // if (status == google.maps.GeocoderStatus.OK) {
                //     if (results[1]) {
                //         alert("Location: " + results[1].formatted_address)
                //     }
                // }
            });
        }//=========================================TagPreferredLocation End========================

        const LatLng = data => {
            if (data.lat) {
                var lat = data.lat
                var lng = data.lng // TagPreferredLocation
            } else if (data.status == google.maps.GeocoderStatus.OK) { rep = data
                var lat = data.results[0].geometry.location.lat
                var lng = data.results[0].geometry.location.lng
            } else alert(data.status)
            var loc = [lat, lng] // Place expressed as lat,lng tuple
            var targetDate = new Date() // Current date/time of user computer
            var timestamp = targetDate.getTime()/1000 + targetDate.getTimezoneOffset() * 60 // Current UTC date/time expressed as seconds since midnight, January 1, 1970 UTC
            var apikey = '{{ env('MAP_API_KEY') }}'
            var apicall = 'https://maps.googleapis.com/maps/api/timezone/json?location=' + loc + '&timestamp=' + timestamp + '&key=' + apikey
            var xhr = new XMLHttpRequest() // create new XMLHttpRequest object
            xhr.open('GET', apicall) // open GET request
            xhr.onload = () => {
                if (xhr.status === 200){ // if Ajax request successful
                    let output = JSON.parse(xhr.responseText) // convert returned JSON string to JSON object
                    // console.log(output) // log API return status for debugging purposes
                    if (output.status == 'OK') { // if API reports everything was returned successfully
                        var offsets = output.dstOffset * 1000 + output.rawOffset * 1000 // get DST and time zone offsets in milliseconds
                        var localdate = new Date(timestamp * 1000 + offsets) // Date object containing current time of Tokyo (timestamp + dstOffset + rawOffset)
                        //console.log(localdate.toLocaleString()) // Display current Tokyo date and time
                        time(localdate, loc)
                    }
                }   else alert('Request failed.  Returned status of ' + xhr.status)
            };  xhr.send() // send request

            // apicall = 'http://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+lng+'&APPID='+'{{ env('WEATHER_API_KEY') }}'
            apicall = 'https://api.openweathermap.org/data/2.5/onecall?lat='+lat+'&lon='+lng+'&APPID='+'{{ env('WEATHER_API_KEY') }}'

            var xhr2 = new XMLHttpRequest()
            xhr2.open('GET', apicall)

            xhr2.onload = () => {
                if (xhr2.status === 200) { // if Ajax request successful
                    output = JSON.parse(xhr2.responseText) // convert returned JSON string to JSON object
                    console.log(output.hourly) // log API return status for debugging purposes
                    var iconcode = output.current.weather[0].icon; var iconmain = output.current.weather[0].main;
                    let temp = [] // Calculate Median
                    output.hourly.forEach( hourly => {
                        temp.push(hourly.temp)
                    })
                    // Get the temperature from the API in units of Kelvin
                    temperatureKelvin = output.current.temp;
                    // temperatureKelvin = output.main.temp;

                    // Convert the temperature from Kelvin to degrees Celsius
                    temperatureCelsius = temperatureKelvin - 273.15;

                    // Convert the temperature from degrees Celsius to degrees Fahrenheit
                    temperatureFahrenheit = temperatureCelsius * 1.8 + 32
                    let F = Math.round(temperatureFahrenheit)
                    var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png"
                    document.getElementById("weather").innerHTML = `<img src="${iconurl}"> ${F}`
                    document.getElementById("temperature").value  = F
                    document.getElementById("median").innerHTML = Math.round((median(temp)- 273.15) * 1.8 + 32)
                } else alert('Request failed.  Returned status of ' + xhr2.status)
            };  xhr2.send()
        }

        const time = (localdate, loc) => {
            let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}
            let hours = localdate.getHours()
            let minutes = localdate.getMinutes()
            let seconds = localdate.getSeconds()
            let strDate = localdate.toLocaleDateString('en', options)
            let ampm = hours >= 12 ? 'pm' : 'am'
            hours = hours % 12
            hours = hours ? hours : 12 // the hour '0' should be '12'
            minutes = minutes < 10 ? '0'+minutes : minutes
            // let strTime = hours + ':' + minutes + ':' +seconds+ ' ' +ampm
            let strTime = hours + ':' + minutes + ' ' + ampm
            //==================================================================\\
            document.getElementById("time").innerHTML = strTime
            document.getElementById("weather_id").value = output.current.weather[0].id
            document.getElementById("localDateTime").value = strDate+' '+strTime
            let Glat = document.getElementById("Plat").value = loc[0]
            let Glng = document.getElementById("Plng").value = loc[1]
            // document.getElementById("region").value = place.address_components[2].long_name
            //=================================================================\\
            @if(isset($Plat))
                let p = Math.PI/180.0
                let r = 6371.0 //The radius of Earth in km
                let lat_diff = (Glat - {{$Plat}})/2.0
                let lng_diff = (Glng - {{$Plng}})/2.0
                let a = Math.pow(Math.sin(p * lat_diff), 2) +
                        Math.pow(Math.sin(p * lng_diff), 2) *
                        Math.cos(p * {{$Plat}}) * Math.cos(p*Glat)
                let d = 2.0 * r * Math.sin(Math.sqrt(a), -1)
                document.getElementById("d").innerHTML = d.toFixed(0)
            @endif // TagCalculateDistance: WeatherModule
        }

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
        function mean(numbers) {
            var total = 0, i;
            for (i = 0; i < numbers.length; i += 1) {
                total += numbers[i];
            }
            return total / numbers.length;
        }

        //
        // alternative mean/average method (from https://www.30secondsofcode.org/snippet/average):
        const mean = (...numbers) => numbers.reduce((acc, val) => acc + val, 0) / numbers.length;
        //
        // usage:
        mean(...[1,2,3]); // 2
        mean(...[0,1,2,3,4,5,6,7,8,9,10]); // 5
        mean(...[1,2,3]); // 2

        /**
         * The "median" is the "middle" value in the list of numbers.
         *
         * @param {Array} numbers An array of numbers.
         * @return {Number} The calculated median value from the specified numbers.
         */
        function median(numbers) {
            // median of [3, 5, 4, 4, 1, 1, 2, 3] = 3
            var median = 0, numsLen = numbers.length;
            numbers.sort();

            if (
                numsLen % 2 === 0 // is even
            ) {
                // average of two middle numbers
                median = (numbers[numsLen / 2 - 1] + numbers[numsLen / 2]) / 2;
            } else { // is odd
                // middle number only
                median = numbers[(numsLen - 1) / 2];
            }

            return median;
        }

        /**
         * The "mode" is the number that is repeated most often.
         *
         * For example, the "mode" of [3, 5, 4, 4, 1, 1, 2, 3] is [1, 3, 4].
         *
         * @param {Array} numbers An array of numbers.
         * @return {Array} The mode of the specified numbers.
         */
        function mode(numbers) {
            // as result can be bimodal or multi-modal,
            // the returned result is provided as an array
            // mode of [3, 5, 4, 4, 1, 1, 2, 3] = [1, 3, 4]
            var modes = [], count = [], i, number, maxIndex = 0;

            for (i = 0; i < numbers.length; i += 1) {
                number = numbers[i];
                count[number] = (count[number] || 0) + 1;
                if (count[number] > maxIndex) {
                    maxIndex = count[number];
                }
            }

            for (i in count)
                if (count.hasOwnProperty(i)) {
                    if (count[i] === maxIndex) {
                        modes.push(Number(i));
                    }
                }

            return modes;
        }

        /**
         * The "range" of a list a numbers is the difference between the largest and
         * smallest values.
         *
         * For example, the "range" of [3, 5, 4, 4, 1, 1, 2, 3] is [1, 5].
         *
         * @param {Array} numbers An array of numbers.
         * @return {Array} The range of the specified numbers.
         */
        function range(numbers) {
            numbers.sort();
            return [numbers[0], numbers[numbers.length - 1]];
        }
    </script>

</body>

</html>
