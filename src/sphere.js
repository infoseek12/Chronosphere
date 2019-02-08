import './settings';

import './js/core';

import './js/changeTime';

import './js/eventHandlers';

import './js/loadInitialMap';

import './js/drawTerminator';

import './js/dateTimePicker';

import './js/moonCalc';

import './js/planetaryOrbits';

import './css/style.css';

const WebFont = require('webfontloader');

WebFont.load({
  google: {
    families: ['Open Sans:400,700']
  }
});

chronoSphere.runInitFunctions();

chronoSphere.updateTime();
setInterval(() => chronoSphere.updateTime(), 100);

chronoSphere.runUpdateFunctions();
setInterval(() => chronoSphere.runUpdateFunctions(), 30000);
