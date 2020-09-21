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

			url: "https://www.n2yo.com/rest/v1/satellite/visualpasses/25544/" + latitude + "/" + longitude + "/0/10/60/&apiKey=C5PW35-XJ6FHB-GPUQKP-4JSL",
			dataType: 'json',

			success: function(result) {
				console.log("N2YO success");
				console.log(result);




				// Now that the next visual pass has been requested. The next goal is to make a request to the SSC NASA API for coordinate data of the ISS over time to plot on the map

				// Store the startUTC & endUTC times of the next visual pass for the ISS depending on the selected coordinates
				var startUnix = result.passes[0].startUTC;
				console.log(startUnix);


				var endUnix = result.passes[0].endUTC;
				console.log(endUnix);


				// Context: I'll now be building the startTime & EndTime parameters for the SSC API Request, which will return the coordinate data of the ISS over the time range.

				// Subtract 5 minutes from the startUTC time. NOTE: JS works in milliseconds so first I have to multiply by 1000ms and then subtract 5 minutes
				// startdateObj = new Date(startUnix * 1000 - 300000);
				// console.log(startdateObj);

				// Store the startTime in a Date() object. NOTE: JS works in milliseconds so first I have to multiply by 1000ms and then subtract 5 minutes
				startdateObj = new Date(startUnix * 1000);
				console.log(startdateObj);



				// Add 5 minutes to the startUTC time. NOTE: JS works in milliseconds so first I have to multiply by 1000ms and then add 5 minutes
				// enddateObj = new Date(startUnix * 1000 + 300000);
				// console.log(enddateObj);

				enddateObj = new Date(endUnix * 1000);
				console.log(enddateObj);



				

				// Build the startTime paramaters for ISO 8601 format
				var startGetYear = startdateObj.getUTCFullYear();
				var startGetMonth = startdateObj.getUTCMonth() + 1;
				var startGetDay = startdateObj.getUTCDate();
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
				



				// Display the Visualization Details into the front-end table
				$("#startTime").html(startdateObj);
				$("#visDuration").html(result.passes[0].duration);
				$("#startAz").html(result.passes[0].startAz);
				$("#startDir").html(result.passes[0].startAzCompass);
				$("#startEl").html(result.passes[0].startEl);
				$("#endAz").html(result.passes[0].endAz);
				$("#endDir").html(result.passes[0].endAzCompass);
				$("#endEl").html(result.passes[0].endEl);
				
				


				ajaxCall2();

			}
		});


		function ajaxCall2(){
			$.ajax({
				// url: "https://sscweb.gsfc.nasa.gov/WS/sscr/2/locations/iss/20200913T223000Z,20200913T224000Z/geo",
				url: "https://sscweb.gsfc.nasa.gov/WS/sscr/2/locations/iss" + startUrlParam + endUrlParam + "/geo",
				dataType: "xml",
				success: function(result2) {
					
					console.log("SSC API Success");
					console.log(result2);


					// var testArray = [];


					// var latArray = $(result2).find("Latitude")[0].textContent;
					// var latValue = parseFloat(latArray);


					// Iterate through each pair of Lat/Long values and generate Marker on the map to show trajectory
					for (var i = 0; i < $(result2).find("Latitude").length; i++) {
						// console.log("test for loop");

						// Empty array to hold one pair of Lat/Long values. This will be set to an empty array on each iteration
						var latlongPair = [];

						

						// Find Latitude[i] value and .push() to latlongPair
						// Note: The .textContent returned is a string; parseFloat() will convert into a numeric value that can be used for Marking the map
						var latString = $(result2).find("Latitude")[i].textContent;
						var latValue = parseFloat(latString);
						latlongPair.push(latValue);



						// Find Longitude[i] value and .push to latlongPair
						// Note: The .textContent returned is a string; parseFloat() will convert into a numeric value that can be used for Marking the map
						var longString = $(result2).find("Longitude")[i].textContent;
						var longValue = parseFloat(longString);
						// var longValue = -74.000;

						// The SSC API returns Longitude values in degrees from 0 to 360 degrees. The Leaflet.js API takes Longitude values from -180 to 180 degrees. This function converts the value accordingly.
						if (longValue > 180) {
							longValue = longValue - 360;
						}

						latlongPair.push(longValue);



						console.log(latlongPair);


						// L.Marker adds a Marker to the map display
						var marker = L.marker(latlongPair).addTo(mymap);
					}





					// Example Marker
					// var marker = L.marker([40.740477760389545, -73.9896583557129]).addTo(mymap);


				}

			});			
		}


	});

});
