chronoSphere.resetToPresent = function resetToPresent() {
  chronoSphere.changeTime(null, null, true);
};

chronoSphere.changeTime = function changeTime(timeChange, timeUnit, reset) {
  chronoSphere.mapTime.add(timeChange, timeUnit);
  if (reset) chronoSphere.mapTime = moment.duration();
  chronoSphere.runUpdateFunctions();
};

chronoSphere.updateTime = function updateTime() {
  chronoSphere.currentTime = moment();

  let timeUp = moment(chronoSphere.currentTime);
  timeUp = timeUp.add(chronoSphere.mapTime);

  document.getElementsByClassName('timezone-offset')[0].value = chronoSphere.timezoneUTCHoursOffset;
  document.getElementsByClassName('presentTime')[0].innerHTML = chronoSphere.currentTime
    .utcOffset(chronoSphere.timezoneUTCHoursOffset)
    .format('MMMM Do, YYYY - h:mm:ss a');
  document.getElementsByClassName('mapTime')[0].innerHTML = timeUp
    .utcOffset(chronoSphere.timezoneUTCHoursOffset)
    .format('MMMM Do, YYYY - h:mm:ss a');
};
