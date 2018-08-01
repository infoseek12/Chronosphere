//Global Variables and Utility Functions
window.chronoSphere = {
  showTerminator: true,
  resolution: 10,
  tileSize: 256,
  southernSun: false,
  currentTime: moment(),
  mapTime: moment.duration() //Moment Duration object, is offset of present maptime from currentTime property
};

chronoSphere.timezoneUTCHoursOffset = (chronoSphere.currentTime.utcOffset()/60);

//Utility functions
Date.prototype.getJulian = function() {
  /* Calculate the present UTC Julian Date. Function is valid after
     * the beginning of the UNIX epoch 1970-01-01 and ignores leap
     * seconds. */
  return this / 86400000 + 2440587.5;
};

Date.prototype.getGMST = function() {
  // Calculate Greenwich Mean Sidereal Time according to
  // http://aa.usno.navy.mil/faq/docs/GAST.php
  let julianDay = this.getJulian();
  let d = julianDay - 2451545.0;
  // Low precision equation is good enough for our purposes.
  return (18.697374558 + 24.06570982441908 * d) % 24;
};