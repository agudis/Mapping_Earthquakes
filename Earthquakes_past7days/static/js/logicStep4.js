// Add console.log to check to see if our code is working. 
console.log('working');


// We create the tile layer that will be the background of our map.
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

// We create the tile layer that will be the background of our map.
let satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

// Create a base layer that holds both maps.
let baseMaps = {
  "Streets": streets,
  "Satellite": satelliteStreets
};

// Create the earthquake layer for our map. 
let earthquakes = new L.layerGroup();

// Define object that contains overlays. This overlay will be visible all the time. 
let overlays = {
  Earthquakes: earthquakes
};

// Create map object with center, zoom level and default layer. 
let map = L.map('mapid', {
  center: [39.5, -98.5],
  zoom: 3,
  layers: [streets]
});


// Pass our map layers into our layer control and add the layer control to the map.
L.control.layers(baseMaps, overlays).addTo(map);

// Retrieve the earthquake GeoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {

// Function to return style data for each earthquake we plot. Pass magnitude into function to calc radius.
  function styleInfo (feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.properties.mag),
      color: '#000000',
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  // Create function to determine color of the circle based on the magnitude of the earthquake. 
  function getColor(magnitude) {
    if (magnitude > 5) {
      return '#ea2c2c';
    }
    if (magnitude > 4) {
      return '#ea822c';
    }
    if (magnitude > 3) {
      return '#ea9c00';
    }
    if (magnitude > 2) {
      return '#eecc00';
    }
    if (magnitude >1) {
      return '#d4ee00';
    }
    return '#98ee00';

  }

  // Use function to get radius of earthquake and base marker on magnitude. 
  // Earthquake with a radius of 0 will be plotted with a radius of 1. 
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 4;
  }

  // Creating a GeoJSON layer with the retrieved data.
  L.geoJSON(data, {
    // Turn each feature into a circleMarker on the map. 

    pointToLayer: function(feature, latlng) {
      console.log(data);
      return L.circleMarker(latlng);
    },
    // Set the style for each circleMarker using styleInfo function
    style: styleInfo,

    // Create mapup for each circleMarker to display mag and location 
    onEachFeature: function(feature, layer) {
      layer.bindPopup('Magnitude: ' + feature.properties.mag + '<br>Location: ' + feature.properties.place);
    }
  }).addTo(earthquakes);

  // Then we add the earthquake layer to our map. 
  earthquakes.addTo(map);
});

