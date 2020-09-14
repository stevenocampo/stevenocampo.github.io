$(document).ready(function() {
    console.log("ready!");


        // START LEAFLET.JS
        var mymap = L.map('mapid').setView([51.505, -0.09], 13);

        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
		    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		    maxZoom: 18,
		    id: 'mapbox/streets-v11',
		    tileSize: 512,
		    zoomOffset: -1,
		    accessToken: 'pk.eyJ1Ijoic3RldmVub2NhbXBvMjYiLCJhIjoiY2tmMjQydmNiMHh1ZDJ5bDNhOWVqd3Q5YSJ9.yiWey4BUevSKxt8_aXgnig'
		}).addTo(mymap);

        // END LEAFLET.JS

});
