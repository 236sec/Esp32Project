/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * map center lat: 13.848285 , lng: 100.569100
 * map id : 517913eb51add9e4
 */

function initMap() {
    var center = {
        lat: 13.848285,
        lng: 100.569100
    };
    var map = new google.maps.Map(document.getElementById("map"), {
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

    function update_location() {
        const client = mqtt.connect('mqtt://iot.cpe.ku.ac.th', {
            username: 'b6510503841',
            password: 'sompon.o@ku.th'
        });
      
        const circle = new google.maps.Circle({
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#FF0000",
            fillOpacity: 0.35,
            map: map,
            center: { lat: 13.848285, lng: 100.569100 },
            radius: 50
        });
      
        client.subscribe('b6510503841/test');
      
        client.on('message', function (topic, message) {
            const location = JSON.parse(message);
            const lat = location.lat;
            const lng = location.lng;
            console.log("Set It !!!")
            circle.setCenter(new google.maps.LatLng(lat, lng));
        });
    }
      
    const mqtt = require('mqtt');
    const client = mqtt.connect('mqtt://iot.cpe.ku.ac.th', {
        username: 'b6510503841',
        password: 'sompon.o@ku.th'
    });
      
    client.on('connect', () => {
        console.log('Connected to MQTT broker');
        client.subscribe('b6510503841/test');
    });
      
    client.on('message', (topic, message) => {
        console.log(`Received message on topic ${topic}: ${message.toString()}`);
        if (topic === 'b6510503841/test') {
            setInterval(update_location, 8000);
        }
    });
    


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



var properties = [{
        price: 'Bus1',
        type: 'home',
        bed: 5,
        bath: 4.5,
        size: 300,
        position: {
            lat: 13.847645,
            lng: 100.567023
        }
    }, {
        price: 'Bus2',
        type: 'building',
        bed: 4,
        bath: 3,
        size: 200,
        position: {
            lat: 13.846753,
            lng: 100.564628
        }
    },
    {
        price: 'Bus3',
        type: 'warehouse',
        bed: 4,
        bath: 4,
        size: 800,
        position: {
            lat: 13.848469,
            lng: 100.565564
        }
    }, {
        address: '98 Aleh Ave, Palo Alto, CA',
        description: 'A lovely store on busy road',
        price: 'Bus4',
        type: 'store-alt',
        bed: 2,
        bath: 1,
        size: 210,
        position: {
            lat: 13.847089,
            lng: 100.568160
        }
    }, {
        address: '2117 Su St, MountainView, CA',
        description: 'Single family house near golf club',
        price: 'Bus5',
        type: 'home',
        bed: 4,
        bath: 3,
        size: 200,
        position: {
            lat: 13.846568,
            lng: 100.570435
        }
    }, {
        address: '197 Alicia Dr, Santa Clara, CA',
        description: 'Multifloor large warehouse',
        price: 'Bus6',
        type: 'warehouse',
        bed: 5,
        bath: 4,
        size: 700,
        position: {
            lat: 13.843550,
            lng: 100.570038
        }
    }, {
        address: '700 Jose Ave, Sunnyvale, CA',
        description: '3 storey townhouse with 2 car garage',
        price: 'Bus7',
        type: 'building',
        bed: 4,
        bath: 4,
        size: 600,
        position: {
            lat: 13.845078,
            lng: 100.567091
        }
    }];
window.initMap = initMap;
