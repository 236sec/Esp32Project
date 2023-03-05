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
  const center = {
    lat: 13.848285,
    lng: 100.569100,
  };
  const map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
    zoom: 16,
    center,
    mapId: "517913eb51add9e4",
  });

  for (const property of properties) {
    const advancedMarkerView = new google.maps.marker.AdvancedMarkerView({
      map,
      content: buildContent(property),
      position: property.position,
      title: property.description,
    });
    const element = advancedMarkerView.element as HTMLElement;
    ["focus", "pointerenter"].forEach((event) => {
      element.addEventListener(event, () => {
        highlight(advancedMarkerView, property);
      });
    });
    ["blur", "pointerleave"].forEach((event) => {
      element.addEventListener(event, () => {
        unhighlight(advancedMarkerView, property);
      });
    });
    advancedMarkerView.addListener("click", (event) => {
      unhighlight(advancedMarkerView, property);
    });
  }

  map.addListener('zoom_changed', () => {
    const markers = document.querySelectorAll('.property');
    const zoom = map.getZoom();
    if (zoom < 15) {
        markers.forEach(marker => {
            marker.style.display = 'none';
        });
    } else {
        markers.forEach(marker => {
            marker.style.display = 'block';
        });
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
  const content = document.createElement("div");
  content.classList.add("property");
  content.innerHTML = `
    <div class="icon">
        <i aria-hidden="true" class="fa-solid fa-bus" title="${property.type}"></i>
        <span class="fa-sr-only">${property.type}</span>
    </div>
    <div class="details">
        <div class="price">${property.price}</div>
        <div class="features">
       
        </div>
    </div>
    `;
  return content;
}


const properties = [{
  price: 'Bus1',
  type: 'home',
  bed: 5,
  bath: 4.5,
  size: 300,
  position: {
    lat: 13.847645,
    lng: 100.567023,
  },
}, {
  price: 'Bus2',
  type: 'building',
  bed: 4,
  bath: 3,
  size: 200,
  position: {
    lat: 13.846753,
    lng: 100.564628,
  },
},
{
  price: 'Bus3',
  type: 'warehouse',
  bed: 4,
  bath: 4,
  size: 800,
  position: {
    lat: 13.848469,
    lng: 100.565564,
  },
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
    lng: 100.568160,
  },
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
    lng: 100.570435,
  },
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
    lng: 100.570038,
  },
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
    lng: 100.567091,
  },
}];



declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;

