/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * map center lat: 13.848285 , lng: 100.569100
 * map id : 517913eb51add9e4
 */

// Set up MQTT client
//var serverUrl = 'ws://your-mqtt-server.com:9001/mqtt';
var clientId = 'client_' + Math.random().toString(16).substr(2, 8);
var serverUrl = 'wss://1625438fb6e94be98331197bdcf3dba7.s2.eu.hivemq.cloud:8884/mqtt';
var client = new Paho.MQTT.Client(serverUrl, clientId);
var map;
var circle = null;
var line_stage;
var BusPath;

function initMap() {
    console.log("Drawing Map...")
    var center = {
        lat: 13.848285,
        lng: 100.569100
    };
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 16,
        center: center,
        mapId: "517913eb51add9e4"
    });
    
    var _loop_1 = function (property) {
        var advancedMarkerView = new google.maps.marker.AdvancedMarkerView({
            map: map,
            content: buildContent(property),
            position: property.position,
            title: property.description
        });
        var element = advancedMarkerView.element;
        ["focus", "pointerenter"].forEach(function (event) {
            element.addEventListener(event, function () {
                highlight(advancedMarkerView, property);
            });
        });
        ["blur", "pointerleave"].forEach(function (event) {
            element.addEventListener(event, function () {
                unhighlight(advancedMarkerView, property);
            });
        });
        advancedMarkerView.addListener("click", function (event) {
            unhighlight(advancedMarkerView, property);
        });
    };
    for (var _i = 0, properties_1 = properties; _i < properties_1.length; _i++) {
        var property = properties_1[_i];
        _loop_1(property);
    }
    map.addListener('zoom_changed', function () {
        var markers = document.querySelectorAll('.property');
        var zoom = map.getZoom();
        if (zoom < 15) {
            markers.forEach(function (marker) {
                marker.style.display = 'none';
            });
        }
        else {
            markers.forEach(function (marker) {
                marker.style.display = 'block';
            });
        }
    });

    function drawBusPath(all_busstop){
        var BusPlanCoordinates = [];
        for (let i = 0; i < all_busstop.length; i++) {
            var busstop = all_busstop[i];
            BusPlanCoordinates.push({'lat':busstop.position.lat,'lng':busstop.position.lng});
          }
          BusPlanCoordinates.push({'lat':all_busstop[0].position.lat,'lng':all_busstop[0].position.lng});
        BusPath = new google.maps.Polyline({
            path: BusPlanCoordinates,
            geodesic: true,
            strokeColor: "#00B0FF",
            strokeOpacity: 1.0,
            strokeWeight: 2,
          });
        BusPath.setMap(map);
        line_stage = 'on'
        document.getElementById("onoff-line").addEventListener("click",onoffLine)
    }

    drawBusPath(properties);
    console.log("Drawing Map Finished")

}
function highlight(markerView, property) {
    markerView.content.classList.add("highlight");
    markerView.element.style.zIndex = 1;
}
function unhighlight(markerView, property) {
    markerView.content.classList.remove("highlight");
    markerView.element.style.zIndex = "";
}
function buildContent(property) {
    var content = document.createElement("div");
    content.classList.add("property");
    content.innerHTML = "\n    <div class=\"icon\">\n        <i aria-hidden=\"true\" class=\"fa-solid fa-bus\" title=\"".concat(property.type, "\"></i>\n        <span class=\"fa-sr-only\">").concat(property.type, "</span>\n    </div>\n    <div class=\"details\">\n        <div class=\"price\">").concat(property.price, "</div>\n        <div class=\"features\">\n       \n        </div>\n    </div>\n    ");
    return content;
}
function buildCircle(property) {
    var content = document.createElement("div");
    content.classList.add("circle_bus");
    content.innerHTML = "\n    <div class=\"icon\">\n        <i aria-hidden=\"true\" class=\"fa-solid fa-bus\" title=\"".concat(property.type, "\"></i>\n        <span class=\"fa-sr-only\">").concat(property.type, "</span>\n    </div>\n    <div class=\"details\">\n        <div class=\"price\">").concat(property.price, "</div>\n        <div class=\"features\">\n       \n        </div>\n    </div>\n    ");
    return content;
}

function onoffLine(){
    if (line_stage === 'on') {
        BusPath.setMap(null)
        line_stage = 'off'
        }
    else{
        BusPath.setMap(map)
        line_stage = 'on'
    }
      
}


var circle_bus = [{price:'none',type: 'bus',bed: 5,bath:4,size:300}]

var properties = [{
    price: 'Bus1',
    type: 'building',
    position: {
        lat: 13.846753,
        lng: 100.564628
    }
},
{
    price: 'Bus2',
    type: 'warehouse',
    position: {
        lat: 13.848469,
        lng: 100.565564
    }
},{
    price: 'Bus3',
    type: 'home',
    position: {
        lat: 13.847645,
        lng: 100.567023
    }
},  {
    price: 'Bus4',
    type: 'store-alt',
    position: {
        lat: 13.847089,
        lng: 100.568160
    }
}, {
    price: 'Bus5',
    type: 'home',
    position: {
        lat: 13.846568,
        lng: 100.570435
    }
}, {
    price: 'Bus6',
    type: 'warehouse',
    position: {
        lat: 13.843550,
        lng: 100.570038
    }
}, {
    price: 'Bus7',
    type: 'building',
    position: {
        lat: 13.845078,
        lng: 100.567091
    }
}];
window.initMap = initMap;

// Callback for connection lost
client.onConnectionLost = function(responseObject) {
    console.log('Connection lost: ' + responseObject.errorMessage);
  };

client.onMessageArrived = function(message) {
    if (circle !== null) {
        circle.setMap(null);
    }
    console.log('Message arrived: ' + message.payloadString);
    const location = JSON.parse(message.payloadString);
    const lat_got = location.lat;
    const lng_got = location.lng;
    circle = new google.maps.Circle({
        content:buildCircle(circle_bus),
        strokeColor: "#FFFFFF",
        strokeOpacity: 1,
        strokeWeight: 2,
        fillColor: "#FFBF00",
        fillOpacity: 1,
        map: map,
        center: { lat: lat_got, lng: lng_got },
        radius: 10 ,
    });

    
    //circle.setCenter(new google.maps.LatLng(lat, lng));
    console.log("Set It !!!")
  };

var options = {
    onSuccess: function() {
      console.log('Connected to broker');
      client.subscribe('b6510503841/test');
    },
    useSSL: true,
    userName: 'b6510503841',
    password: 'tbs36453'
  };
  

// Connect to MQTT server
client.connect(options);



// Subscribe to location
var topic = 'b6510503841/test';
client.subscribe(topic);
