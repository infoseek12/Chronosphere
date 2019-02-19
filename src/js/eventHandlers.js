//TimeBar
document
  .getElementsByClassName('timeReset')[0]
  .addEventListener('click', () => chronoSphere.resetToPresent(), false, { passive: true });

//Change time
document
  .getElementsByClassName('yearB')[0]
  .addEventListener('click', () => chronoSphere.changeTime(-1, 'years'), false, { passive: true });

document
  .getElementsByClassName('monthB')[0]
  .addEventListener('click', () => chronoSphere.changeTime(-1, 'months'), false, { passive: true });

document
  .getElementsByClassName('dayB')[0]
  .addEventListener('click', () => chronoSphere.changeTime(-1, 'days'), false, { passive: true });

document
  .getElementsByClassName('hourB')[0]
  .addEventListener('click', () => chronoSphere.changeTime(-1, 'hours'), false, { passive: true });

document
  .getElementsByClassName('hourA')[0]
  .addEventListener('click', () => chronoSphere.changeTime(1, 'hours'), false, { passive: true });

document
  .getElementsByClassName('dayA')[0]
  .addEventListener('click', () => chronoSphere.changeTime(1, 'days'), false, { passive: true });

document
  .getElementsByClassName('monthA')[0]
  .addEventListener('click', () => chronoSphere.changeTime(1, 'months'), false, { passive: true });

document
  .getElementsByClassName('yearA')[0]
  .addEventListener('click', () => chronoSphere.changeTime(1, 'years'), false, { passive: true });
