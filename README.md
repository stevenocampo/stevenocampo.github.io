# International Space Station Sighting Tracker

### Main Goal of Project
The function of this front-end application is for the end-user to select a point on the map to represent an observer's location, and then output the details for the next International Space Station (ISS) sighting from that coordinate. The map will plot the trajectory of the ISS during the sighting, and the table will outline the details that the observer can use to locate the ISS in the night sky.

### Instructions for Use
1. Using the map functionality, click anywhere on the map to represent the observer's location.
2. Click the "Get Next ISS Sighting!" button.
3. The "Viewing Details" table will outline details that the observer can use to locate the ISS in the night sky.
4. Zoom Out on the map to view the trajectory that the ISS will take during the viewing.

### APIs Used

##### N2YO API
The purpose of this API is to provide data to build satellite tracking or prediction applications.

The endpoint that I've used is the "Get Visual Passes" endpoint, which returns the predicted visual passes for any satellite relative to a location on Earth. A "visual pass" is a pass that should be optically visible on the entire (or partial) duration of crossing the sky. For that to happen, the satellite must be above the horizon, illuminated by Sun (not in Earth shadow), and the sky dark enough to allow visual satellite observation.

This API does not respond with the sufficient future location data of the satellite. Therefore, once I knew the future sighting details for the ISS, I needed to use the following API to request the coordinates to plot on the map.

##### NASA Satellite Situation Center (SSC) API
This API allows the user to request Location data for various satellites. The request requires a timeRange in ISO 8601 format, and the response contains the Latitude/Longitude information for every minute of the flight trajectory.


### Outside Libraries Used
##### Leaflet.js
Leaflet is an open-source JavaScript library for interactive maps. I used this library to achieve the following:
1. Display the map with functioning controls
2. Upon clicking the Map, an event object is created which returns the Latitude/Longitude values of the clicked location
3. Use a built-in function to mark the Latitude/Longitude values of the ISS trajectory on the map



### Technical Challenges & Milestones
- Nested AJAX Calls: I ran into difficulty finding the most efficient way to intiate an initial API call, and then use the results of this response to create another AJAX request to the 2nd API. Ultimately I was able to use a Nested approach to resolve this.
- Date/Time format differences between APIs: The N2YO app responds with time in UNIX time, while the request for the NASA SSC API requires ISO 8601. Since ISO 8601 requires the date/time format YYYYMMDDHH, I had to create a condition to prepend a '0' to  any Month, Day, Hour value that was < 10.
- Converting XML <Latitude>/<Longitude> node values from "string" to "numeric" values: In the example <Latitude>45.000</Latitude>, I had difficulty finding a way to store the contents of the node as a numeric value, and not a string, since I needed numeric values to plot on the map. Ultimately I was able to use "parseFloat()"" to solve this problem.
- Longitude Range Format Differences: The SSC API returns Longitude values in degrees from 0 to 360 degrees. The Leaflet.js API takes Longitude values from -180 to 180 degrees. I therefore had to create a calculation in my code to convert to the proper Longitude format to plot the trajectory.

### Future Iterations?
1. After the user has received their sighting information, automatically zoom out on the map to show the ISS trajectory.
2. If it’s the first Marker, make the marker color Green to indicate the first sight position. Set the last marker color to red.
3. Request the user to input elevation to pass to the N2YO API. Currently the observer elevation is hardcoded to '0' (sea-level).