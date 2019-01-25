//TimeBar
document.getElementsByClassName("timeReset")[0].addEventListener("click",
  () => {
    chronoSphere.resetToPresent();
    console.log;
  }, false);


//Change time
document.getElementsByClassName("yearB")[0].addEventListener("click",
  () => chronoSphere.changeTime(-1, "years")
  , false);

document.getElementsByClassName("monthB")[0].addEventListener("click",
  () => chronoSphere.changeTime(-1, "months")
  , false);

document.getElementsByClassName("dayB")[0].addEventListener("click",
  () => chronoSphere.changeTime(-1, "days")
  , false);

document.getElementsByClassName("hourB")[0].addEventListener("click",
  () => chronoSphere.changeTime(-1, "hours")
  , false);

document.getElementsByClassName("hourA")[0].addEventListener("click",
  () => chronoSphere.changeTime(1, "hours")
  , false);

document.getElementsByClassName("dayA")[0].addEventListener("click",
  () => chronoSphere.changeTime(1, "days")
  , false);

document.getElementsByClassName("monthA")[0].addEventListener("click",
  () => chronoSphere.changeTime(1, "months")
  , false);

document.getElementsByClassName("yearA")[0].addEventListener("click",
  () => chronoSphere.changeTime(1, "years")
  , false);

//Date time picker
let mapTimeText = document.getElementsByClassName("mapTime")[0];
let timeUp = moment(chronoSphere.currentTime);
timeUp = timeUp.add(chronoSphere.mapTime);

let dtOpts= {
    enableTime: true,
    dateFormat: "Y-m-d H:i",
    defaultDate: timeUp.utcOffset(chronoSphere.timezoneUTCHoursOffset).format("YYYY-MM-DD HH:mm"),
    onClose: function(dateObj, dateStr, instance) {
      let ChangeDateStr = moment(dateStr);
      chronoSphere.mapTime = moment.duration(ChangeDateStr.diff(chronoSphere.currentTime.utcOffset(chronoSphere.timezoneUTCHoursOffset).format()));
      chronoSphere.updateDisplay();
  }
};



chronoSphere.datePicker = new flatpickr(mapTimeText, dtOpts);