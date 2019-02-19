import 'leaflet';

import 'leaflet/dist/leaflet.css';

import marker from 'leaflet/dist/images/marker-icon.png';
import marker2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: marker2x,
  iconUrl: marker,
  shadowUrl: markerShadow
});

chronoSphere.map = new L.Map('map', {
  detectRetina: true,
  center: new L.LatLng(120, 0),
  zoom: 2,
  minZoom: 2,
  maxZoom: 8,
  maxBoundsViscosity: 0.5,
  preferCanvas: true,
  maxBounds: [L.latLng(-90, -27000), L.latLng(90, 27000)]
});

L.tileLayer(
  'https://api.mapbox.com/styles/v1/infoseek/cjdw9ibdb3po22tk4fndz0ke5/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaW5mb3NlZWsiLCJhIjoiY2pkajV6OXFtMWpqaDMzcGdyaGh6cjJ2NiJ9.ARSABTSiSWmuSQA2fbpzUw',
  { attribution: 'Mapbox©' }
).addTo(chronoSphere.map);
