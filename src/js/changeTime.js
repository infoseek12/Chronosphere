chronoSphere.resetToPresent = function(){
  chronoSphere.changeTime(null, null, true);
}


chronoSphere.changeTime = function(timeChange, timeUnit, reset) {
  chronoSphere.mapTime.add(timeChange, timeUnit);
  let changedTime = reset ? chronoSphere.currentTime.format() : chronoSphere.currentTime.add(chronoSphere.mapTime).format()

  let nightTime2 = L.TileLayer.BoundaryCanvas.createFromLayer(
    chronoSphere.nightTimeMap,
    {
      opacity: 0.9,
      boundary: L.terminator({ time: changedTime })
    }
  ).addTo(chronoSphere.map);

  chronoSphere.map.removeLayer(chronoSphere.nightTimeMap);

  chronoSphere.nightTimeMap = nightTime2;
};


chronoSphere.updateTimeDisplay = function() {
  chronoSphere.currentTime = moment();
  document.getElementsByClassName("timezone-offset")[0].value = chronoSphere.timezoneUTCHoursOffset;
  document.getElementsByClassName("presentTime")[0].innerHTML = chronoSphere.currentTime.utcOffset(chronoSphere.timezoneUTCHoursOffset).format("MMMM Do, YYYY - h:mm:ss a");
  document.getElementsByClassName("mapTime")[0].innerHTML = chronoSphere.currentTime.add(chronoSphere.mapTime).utcOffset(chronoSphere.timezoneUTCHoursOffset).format("MMMM Do, YYYY - h:mm:ss a");
};