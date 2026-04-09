
// 3. Initialize the map
maptilersdk.config.apiKey = map_API;
const map = new maptilersdk.Map({
    container: 'map', // ID of the div
    style: maptilersdk.MapStyle.STREETS, // Style: STREETS, SATELLITE, OUTDOOR, etc.
    center: [75.3356, 14.9725], // [Longitude, Latitude]
    zoom: 14
});