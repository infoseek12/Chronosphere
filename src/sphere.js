import "./css/style.css";

import "./settings.js";

import "leaflet";
import "leaflet/dist/leaflet.css";
import marker from "leaflet/dist/images/marker-icon.png";
import marker2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: marker2x,
  iconUrl: marker,
  shadowUrl: markerShadow
});

import "./js/calculateTerminator.js";
import "./js/drawTerminator.js";

import "./js/loadInitialMap.js";

import "./js/changeTime.js";

import "./js/eventHandlers.js";

setInterval(function(){ chronoSphere.updateTimeDisplay(); }, 1000);