let initPicker = () => {
  let mapTimeText = document.getElementsByClassName("mapTime")[0];
  let timeUp = moment(chronoSphere.currentTime);
  timeUp = timeUp.add(chronoSphere.mapTime);
  let dtOpts = {
    enableTime: true,
    dateFormat: "Y-m-d H:i",
    defaultDate: timeUp
      .utcOffset(chronoSphere.timezoneUTCHoursOffset)
      .format("YYYY-MM-DD HH:mm"),
    onClose: function(dateObj, dateStr, instance) {
      let ChangeDateStr = moment(dateStr);
      chronoSphere.mapTime = moment.duration(
        ChangeDateStr.diff(
          chronoSphere.currentTime
            .utcOffset(chronoSphere.timezoneUTCHoursOffset)
            .format()
        )
      );
      chronoSphere.runUpdateFunctions();
    }
  };

  chronoSphere.datePicker = new flatpickr(mapTimeText, dtOpts);
};

let updatePicker = () => {
  let timeUp = moment(chronoSphere.currentTime);
  timeUp = timeUp.add(chronoSphere.mapTime);
  chronoSphere.datePicker.setDate(
    timeUp
      .utcOffset(chronoSphere.timezoneUTCHoursOffset)
      .format("YYYY-MM-DD HH:mm")
  );
};

chronoSphere.addInitFunction(initPicker);

chronoSphere.addUpdateFunction(updatePicker);
