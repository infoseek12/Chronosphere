chronoSphere.resetToPresent = function(){
  chronoSphere.changeTime(null, null, true);
}

chronoSphere.changeTime = function(timeChange, timeUnit, reset) {
  chronoSphere.mapTime.add(timeChange, timeUnit);
  if (reset) chronoSphere.mapTime = moment.duration();
  chronoSphere.updateDisplay();
};

chronoSphere.updateTime = function (){
  chronoSphere.currentTime = moment();

  let timeUp = moment(chronoSphere.currentTime);
  timeUp = timeUp.add(chronoSphere.mapTime);

  document.getElementsByClassName("timezone-offset")[0].value = chronoSphere.timezoneUTCHoursOffset;
  document.getElementsByClassName("presentTime")[0].innerHTML = chronoSphere.currentTime.utcOffset(chronoSphere.timezoneUTCHoursOffset).format("MMMM Do, YYYY - h:mm:ss a");
  document.getElementsByClassName("mapTime")[0].innerHTML = timeUp.utcOffset(chronoSphere.timezoneUTCHoursOffset).format("MMMM Do, YYYY - h:mm:ss a");
}

chronoSphere.updateDisplay = function() {
  let timeUp = moment(chronoSphere.currentTime);
  timeUp = timeUp.add(chronoSphere.mapTime);

  let nightTime2 = L.TileLayer.BoundaryCanvas.createFromLayer(
    chronoSphere.nightTimeMap,
    {
      opacity: 0.9,
      boundary: L.terminator({ time: timeUp })
    }
  ).addTo(chronoSphere.map);

  
  let chronUp = () => {
    chronoSphere.map.removeLayer(chronoSphere.nightTimeMap);
    chronoSphere.nightTimeMap = nightTime2;
  }

  setTimeout(chronUp, 250);

  chronoSphere.runUpdateFunctions();
};