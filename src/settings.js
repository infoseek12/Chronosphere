//Global Variables and Utility Functions
window.chronoSphere = {
  showTerminator: true,
  resolution: 10,
  tileSize: 256,
  southernSun: false,
  currentTime: moment(),
  mapTime: moment.duration() //Moment Duration object, is offset of present maptime from currentTime property
};

chronoSphere.timezoneUTCHoursOffset = chronoSphere.currentTime.utcOffset() / 60;
