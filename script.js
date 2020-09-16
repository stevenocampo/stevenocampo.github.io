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


    // Declare the variables that will store the Latitude & Longitude values from the map
    var latitude;
    var longitude;

	// The following function will run when the map is clicked by the user
	function onMapClick(e) {
		
		// Parse through the clicked MouseEvent object and store the Latitude/Longitude values into the appropriate variables. These variables will then be used for the N2YO API request
		console.log(e);
		console.log(e.latlng);

		latitude = e.latlng.lat;
		longitude = e.latlng.lng;

		console.log(latitude);
		console.log(longitude);

	}

	mymap.on('click', onMapClick);


	// When the HTML <button> is clicked, an AJAX call is made to initiate the API Request to the N2YO API using the coorinates that were stored
    $("#getSighting").click(function() {
		console.log("Button Click");
		console.log(latitude);
		console.log(longitude);

		$.ajax({	
			
			// Example url: "https://www.n2yo.com/rest/v1/satellite/visualpasses/25544/40.862137/-74.160393/40/10/60/&apiKey=C5PW35-XJ6FHB-GPUQKP-4JSL",

			url: "https://www.n2yo.com/rest/v1/satellite/visualpasses/25544/" + latitude + "/" + longitude + "/40/10/60/&apiKey=C5PW35-XJ6FHB-GPUQKP-4JSL",
			dataType: 'json',

			success: function(result) {
				console.log("N2YO success");
				console.log(result);
			}
		});		
	});

});
