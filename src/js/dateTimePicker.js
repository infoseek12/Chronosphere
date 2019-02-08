import flatpickr from 'flatpickr';
import 'flatpickr/dist/themes/dark.css';

const initPicker = () => {
  const mapTimeText = document.getElementsByClassName('mapTime')[0];
  const timeUp = moment(chronoSphere.currentTime).add(chronoSphere.mapTime);
  const dtPickrOpts = {
    enableTime: true,
    dateFormat: 'Y-m-d H:i',
    defaultDate: timeUp.utcOffset(chronoSphere.timezoneUTCHoursOffset).format('YYYY-MM-DD HH:mm'),
    onClose: function closeDateTime(dateObj, dateStr) {
      const ChangeDateStr = moment(dateStr);
      chronoSphere.mapTime = moment.duration(
        ChangeDateStr.diff(
          chronoSphere.currentTime.utcOffset(chronoSphere.timezoneUTCHoursOffset).format()
        )
      );
      chronoSphere.runUpdateFunctions();
    }
  };

  chronoSphere.datePicker = new flatpickr(mapTimeText, dtPickrOpts);
};

const updatePicker = () => {
  const timeUp = moment(chronoSphere.currentTime).add(chronoSphere.mapTime);
  chronoSphere.datePicker.setDate(
    timeUp.utcOffset(chronoSphere.timezoneUTCHoursOffset).format('YYYY-MM-DD HH:mm')
  );
};

chronoSphere.addInitFunction(initPicker);

chronoSphere.addUpdateFunction(updatePicker);
