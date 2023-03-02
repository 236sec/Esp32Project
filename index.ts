/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

let map: google.maps.Map, infoWindow: google.maps.InfoWindow;

function initMap(): void {
  const map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
    center: { lat: 13.848285, lng: 100.569100 },
    zoom: 18,
    mapId: '517913eb51add9e4'
  });

  const BusStopImg = document.createElement('img');
  BusStopImg.src = 'https://i.postimg.cc/7h6M1ct0/icons8-bus-24.png';
  const BusStop1 = new google.maps.marker.AdvancedMarkerView({
    map,
    position: { lat: 13.848285, lng: 100.569100 },
    content: BusStopImg,
    title: 'Bus1'
});

}

let pos = {lat: 13.848285 ,
  lng: 100.569100 ,};
  
declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
export {};

