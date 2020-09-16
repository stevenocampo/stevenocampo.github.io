$(document).ready(function() {
    console.log("ready!");


        // START LEAFLET.JS
        
        // Leaflet.js: "L.map" initializes a map object. The map's center coordinates and zoom setting are configured
        var mymap = L.map('mapid').setView([40.756, -73.986], 13);

        // Leaflet.js: "L.tileLayer" loads and displays the layer on the map
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
		    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		    maxZoom: 18,
		    id: 'mapbox/streets-v11',
		    tileSize: 512,
		    zoomOffset: -1,
		    accessToken: 'pk.eyJ1Ijoic3RldmVub2NhbXBvMjYiLCJhIjoiY2tmMjQydmNiMHh1ZDJ5bDNhOWVqd3Q5YSJ9.yiWey4BUevSKxt8_aXgnig'
		}).addTo(mymap);

        // END LEAFLET.JS



		// The following function will run when the map is clicked by the user
		function onMapClick(e) {
			
			// Parse through the clicked MouseEvent object and store the Latitude/Longitude values into variables. These variables will then be used for the N2YO API request
			console.log(e);
			console.log(e.latlng);
			var hatchLatitude = e.latlng.lat;
			var hatchLongitude = e.latlng.lng;

			console.log(hatchLatitude);
			console.log(hatchLongitude);

		}

		mymap.on('click', onMapClick);

});
