chronoSphere.map = new L.Map("map", {
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
  "https://api.mapbox.com/styles/v1/infoseek/cjdw9ibdb3po22tk4fndz0ke5/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaW5mb3NlZWsiLCJhIjoiY2pkajV6OXFtMWpqaDMzcGdyaGh6cjJ2NiJ9.ARSABTSiSWmuSQA2fbpzUw"
).addTo(chronoSphere.map);

chronoSphere.nightTimeMap = L.TileLayer.boundaryCanvas(
  "https://api.mapbox.com/styles/v1/infoseek/cjf4g08rk19me2sp368t2lhvg/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaW5mb3NlZWsiLCJhIjoiY2pkajV6OXFtMWpqaDMzcGdyaGh6cjJ2NiJ9.ARSABTSiSWmuSQA2fbpzUw",
  {
    boundary: L.terminator({ time: chronoSphere.currentTime.add(chronoSphere.mapTime).format() })
  }
).addTo(chronoSphere.map);
