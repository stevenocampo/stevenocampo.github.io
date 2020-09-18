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
				console.log(result.passes[0].startUTC);



				// Now that the next visual pass has been requested. The next goal is to make a request to the SSC NASA API for coordinate data of the ISS over time to plot on the map

				// Store the startUTC time of the next visual pass for the ISS depending on the selected coordinates
				var startUnix = result.passes[0].startUTC;
				console.log(startUnix);




				// Context: I'll now be building the startTime & EndTime parameters for the SSC API Request, which will return the coordinate data of the ISS over the time range.

				// Subtract 5 minutes from the startUTC time. NOTE: JS works in milliseconds so first I have to multiply by 1000ms and then subtract 5 minutes
				startdateObj = new Date(startUnix * 1000 - 300000);
				console.log(startdateObj);				

				// Add 5 minutes to the startUTC time. NOTE: JS works in milliseconds so first I have to multiply by 1000ms and then add 5 minutes
				enddateObj = new Date(startUnix * 1000 + 300000);
				console.log(enddateObj);

				

				// Build the startTime paramaters for ISO 8601 format
				var startGetYear = startdateObj.getUTCFullYear();
				var startGetMonth = startdateObj.getUTCMonth() + 1;
				var startGetDay = startdateObj.getUTCDate();
				// var startGetHours = startdateObj.getHours();
				var startGetHours = startdateObj.getUTCHours();
				var startGetMinutes = startdateObj.getUTCMinutes();


				// Build the endTime paramater for ISO 8601 format
				var endGetYear = enddateObj.getUTCFullYear();
				var endGetMonth = enddateObj.getUTCMonth() + 1;
				var endGetDay = enddateObj.getUTCDate();
				var endGetHours = enddateObj.getUTCHours();
				var endGetMinutes = enddateObj.getUTCMinutes();

	


				// Build startTime URL path. If the Month, Day, Hour, or Minute value is < 10, prepend a '0' to make the entire timestamp in ISO 8601 format
				startUrlParam = "/" + startGetYear + startGetMonth.toString().padStart(2, '0') + startGetDay.toString().padStart(2, '0') + "T" + startGetHours.toString().padStart(2, '0') + startGetMinutes.toString().padStart(2, '0') + "00Z";
				console.log(startUrlParam);

				// Build endTime URL path. If the Month, Day, Hour, or Minute value is < 10, prepend a '0' to make the entire timestamp in ISO 8601 format
				endUrlParam = "," + endGetYear + endGetMonth.toString().padStart(2, '0') + endGetDay.toString().padStart(2, '0') + "T" + endGetHours.toString().padStart(2, '0') + endGetMinutes.toString().padStart(2, '0') + "00Z";
				console.log(endUrlParam);
				



				ajaxCall2();

			}
		});


		function ajaxCall2(){
			$.ajax({
				// url: "https://sscweb.gsfc.nasa.gov/WS/sscr/2/locations/iss/20200913T223000Z,20200913T224000Z/geo",
				url: "https://sscweb.gsfc.nasa.gov/WS/sscr/2/locations/iss" + startUrlParam + endUrlParam + "/geo",
				success: function(result2) {
					
					console.log("SSC API Success");
					console.log(result2);



				}

			});			
		}


	});

});
