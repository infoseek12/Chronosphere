import "./css/style.css";

import "leaflet";
import "leaflet/dist/leaflet.css";

import "flatpickr/dist/themes/dark.css";

import "./settings.js";

import marker from "leaflet/dist/images/marker-icon.png";
import marker2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: marker2x,
  iconUrl: marker,
  shadowUrl: markerShadow
});

import flatpickr from "flatpickr";

import "./js/core.js";

import "./js/changeTime.js";

import "./js/eventHandlers.js";

import "./js/calculateTerminator.js";
import "./js/drawTerminator.js";

import "./js/loadInitialMap.js";

import "./js/dateTimePicker.js";

import "./js/moonCalc.js";

import "./js/planetaryOrbits.js";

chronoSphere.runInitFunctions();

chronoSphere.updateTime();
setInterval(function(){ chronoSphere.updateTime(); }, 1000);

chronoSphere.updateDisplay();
setInterval(function(){ chronoSphere.updateDisplay(); }, 60000);