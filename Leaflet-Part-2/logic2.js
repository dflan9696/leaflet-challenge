// Store our API as queryURL
const queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";

// Perform a GET request to the query URL
d3.json(queryURL).then(function(data){
    // Console log the data retrieved 
    console.log(data);
    // Send the data.features to the createFeatures function.
    features(data.features);
});


// Legend and circle colors based on depth
function chooseColorLegend(leg){
    switch(true){
        case(-10 <= leg && leg <= 10):
            return "#35BC00"; 
        case (10 <= leg && leg <= 30):
            return "#BCBC00";
        case (30 <= leg && leg <= 50):
            return "#FFC300";
        case (50 <= leg && leg <= 70):
            return "#FF5733";
        case (70 <= leg && leg <= 90):
            return "#BC3500";
        default:
            return "#BC0000";
    }
}

function features(earthquakeData) {

    // Define a function that we want to run once for each feature
    // Give each feature a popup that describes the place and time of the earthquake
    function onEachFeature(feature, layer) {
      layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p>Date: ${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
    }

    // Create a GeoJSON layer containing the features array
    function createCircleMarker(feature, latlng){
        let options = {
            radius:feature.properties.mag*3,
            fillColor: chooseColorLegend(feature.geometry.coordinates[2]),
            color: chooseColorLegend(feature.geometry.coordinates[2]),
            weight: 1,
            opacity: 0.3,
            fillOpacity: 0.8
        } 
        return L.circleMarker(latlng, options);
    }
    // Create a variable for earthquakes to house latlng, each feature for popup, and cicrle
    let earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: createCircleMarker
    });
     
    // Send earthquakes layer to the createMap function
    createMap(earthquakes);
}

// Create map
function createMap(earthquakes) {
  // create base layer
  let base = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    //make map object and add layers
    let myMap = L.map("map", {
        center: [10.05, 10.24],
        zoom: 2,
        layers: [base, earthquakes]
    });
 
    //Make the legend
    let legend = L.control({position: "bottomright"});
        legend.onAdd = function() {
            let div = L.DomUtil.create("div", "info legend");
            let limits = [-10, 10, 30, 50, 70, 90];
            var labels = [];

            div.innerHTML += "<h1>Depth</h1>" + "</div>";

            for (var i = 0; i < limits.length; i++) {
                labels.push('<ul style="background-color:' + chooseColorLegend(limits[i]+1) + '"> <span>' + limits[i] + (limits[i + 1] ? '&ndash;' + limits[i + 1] + '' : '+') + '</span></ul>');
              }
      
            // add each label list item to the div under the <ul> tag
            div.innerHTML += "<ul>" + labels.join("") + "</ul>";
          
          return div;
        };
          
    // Adding the legend to the map
    legend.addTo(myMap);  
}