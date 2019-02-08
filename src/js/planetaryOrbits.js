/*
========================================
THE JAVASCRIPT SOLAR SYSTEM SIMULATION
========================================
PART V: COMPLETE JAVASCRIPT ORRERY
----------------------------------------
Please visit the URL to learn more:
http://www.planetaryorbits.com/tutorial-javascript-orbit-simulation.html
----------------------------------------
*/

//You can verify this simulation with this NASA website:
//http://space.jpl.nasa.gov/
//NOTE: The First Point of Aries in the NASA simulation is due north!
let newdd,
  newmm,
  newyyyy,
  aGen,
  eGen,
  iGen,
  WGen,
  wGen,
  LGen,
  MGen,
  EGen,
  trueAnomalyArgGen,
  K,
  nGen,
  rGen,
  xGen,
  yGen,
  zGen,
  i,
  m;
let offsetX, offsetY;
let planetNames = [];
let offsetPlanetsX = 35;

let T6 = {
  //Define background canvas
  canvasbackground: document.getElementById("LAYER_BACKGROUND_T6"), //Grab the HTML5 Background Canvas (will only be drawn once)
  contextbackground: null,
  //Define foreground canvas
  canvasforeground: document.getElementById("LAYER_FOREGROUND_T6"), //Grab the HTML5 Foreground Canvas (elements on this canvas will be rendered every frame; moving objects)
  contextforeground: null,
  width: 450,
  height: 450,

  julianCenturyInJulianDays: 36525,
  julianEpochJ2000: 2451545.0,
  julianDate: null,
  current: null,
  DAY: null,
  MONTH: null,
  YEAR: null,

  //ELEMENTS @ J2000: a, e, i, mean longitude (L), longitude of perihelion, longitude of ascending node
  planetElements: [
    //MERCURY (0)
    [0.38709927, 0.20563593, 7.00497902, 252.2503235, 77.45779628, 48.33076593],
    //VENUS (1)
    [
      0.72333566,
      0.00677672,
      3.39467605,
      181.9790995,
      131.60246718,
      76.67984255
    ],
    //EARTH (2)
    [1.00000261, 0.01671123, -0.00001531, 100.46457166, 102.93768193, 0.0],
    //MARS (3)
    [1.52371034, 0.0933941, 1.84969142, -4.55343205, -23.94362959, 49.55953891],
    //JUPITER (4)
    [5.202887, 0.04838624, 1.30439695, 34.39644051, 14.72847983, 100.47390909],
    //SATURN (5)
    [
      9.53667594,
      0.05386179,
      2.48599187,
      49.95424423,
      92.59887831,
      113.66242448
    ],
    //URANUS (6)
    [
      19.18916464,
      0.04725744,
      0.77263783,
      313.23810451,
      170.9542763,
      74.01692503
    ],
    //NEPTUNE (7)
    [
      30.06992276,
      0.00859048,
      1.77004347,
      -55.12002969,
      44.96476227,
      131.78422574
    ]
  ],

  //RATES: a, e, i, mean longitude (L), longitude of perihelion, longitude of ascending node
  planetRates: [
    //MERCURY (0)
    [
      0.00000037,
      0.00001906,
      -0.00594749,
      149472.67411175,
      0.16047689,
      -0.1253408
    ],
    //VENUS (1)
    [
      0.0000039,
      -0.00004107,
      -0.0007889,
      58517.81538729,
      0.00268329,
      -0.27769418
    ],
    //EARTH (2)
    [0.00000562, -0.00004392, -0.01294668, 35999.37244981, 0.32327364, 0.0],
    //MARS (3)
    [
      0.00001847,
      0.00007882,
      -0.00813131,
      19140.30268499,
      0.44441088,
      -0.29257343
    ],
    //JUPITER (4)
    [
      -0.00011607,
      -0.00013253,
      -0.00183714,
      3034.74612775,
      0.21252668,
      0.20469106
    ],
    //SATURN (5)
    [
      -0.0012506,
      -0.00050991,
      0.00193609,
      1222.49362201,
      -0.41897216,
      -0.28867794
    ],
    //URANUS (6)
    [
      -0.00196176,
      -0.00004397,
      -0.00242939,
      428.48202785,
      0.40805281,
      0.04240589
    ],
    //NEPTUNE (7)
    [0.00026291, 0.00005105, 0.00035372, 218.45945325, -0.32241464, -0.00508664]
  ],

  orbitalElements: null,

  xMercury: null,
  yMercury: null,
  xVenus: null,
  yVenus: null,
  xEarth: null,
  yEarth: null,
  xMars: null,
  yMars: null,
  xJupiter: null,
  yJupiter: null,
  xSaturn: null,
  ySaturn: null,
  xUranus: null,
  yUranus: null,
  xNeptune: null,
  yNeptune: null,

  scale: 50,

  //Divide AU multiplier by this number to fit it into  "orrery" style solar system (compressed scale)
  jupiterScaleDivider: 2.5,
  saturnScaleDivider: 3.7,
  uranusScaleDivider: 6.2,
  neptuneScaleDivider: 8.7
};

function findOffset() {
  var BB = T6.canvasforeground.getBoundingClientRect();
  offsetX = BB.left;
  offsetY = BB.top;
}

function initPlanets() {
  T6.contextbackground = T6.canvasbackground.getContext("2d"); //Need the context to be able to draw on the canvas
  T6.contextforeground = T6.canvasforeground.getContext("2d"); //Need the context to be able to draw on the canvas

  T6.width = T6.canvasforeground.width;
  T6.height = T6.canvasforeground.height;

  updatePlanetTime();

  findOffset();
  window.onscroll = e => findOffset();
  window.onresize = e => findOffset();

  T6.canvasforeground.onmousemove = e => displayToolTip(e);

  //Render background once (render the Sun at center)
  renderBackground_T6();
  //Start the main loop
  runPlanets();
}

//Loop Function that runs as fast as possible (logic speed)
function runPlanets() {
  updatePlanetTime();
  //Get Mercury Heliocentric Ecliptic Coordinates
  T6.orbitalElements = plotPlanet_T6(T6.T, 0);
  T6.xMercury = T6.orbitalElements[0];
  T6.yMercury = T6.orbitalElements[1];
  //Get Venus Heliocentric Ecliptic Coordinates
  T6.orbitalElements = plotPlanet_T6(T6.T, 1);
  T6.xVenus = T6.orbitalElements[0];
  T6.yVenus = T6.orbitalElements[1];
  //Get Earth Heliocentric Ecliptic Coordinates
  T6.orbitalElements = plotPlanet_T6(T6.T, 2);
  T6.xEarth = T6.orbitalElements[0];
  T6.yEarth = T6.orbitalElements[1];
  //Get Mars Heliocentric Ecliptic Coordinates
  T6.orbitalElements = plotPlanet_T6(T6.T, 3);
  T6.xMars = T6.orbitalElements[0];
  T6.yMars = T6.orbitalElements[1];
  //Get Jupiter Heliocentric Ecliptic Coordinates
  T6.orbitalElements = plotPlanet_T6(T6.T, 4);
  T6.xJupiter = T6.orbitalElements[0];
  T6.yJupiter = T6.orbitalElements[1];
  //Get Saturn Heliocentric Ecliptic Coordinates
  T6.orbitalElements = plotPlanet_T6(T6.T, 5);
  T6.xSaturn = T6.orbitalElements[0];
  T6.ySaturn = T6.orbitalElements[1];
  //Get Uranus Heliocentric Ecliptic Coordinates
  T6.orbitalElements = plotPlanet_T6(T6.T, 6);
  T6.xUranus = T6.orbitalElements[0];
  T6.yUranus = T6.orbitalElements[1];
  //Get Neptune Heliocentric Ecliptic Coordinates
  T6.orbitalElements = plotPlanet_T6(T6.T, 7);
  T6.xNeptune = T6.orbitalElements[0];
  T6.yNeptune = T6.orbitalElements[1];

  renderForeground_T6();
}

//RENDER BACKGROUND. ONLY INCLUDES STATIC ELEMENTS ON SCREEN.
function renderBackground_T6() {
  //Set background color of canvas
  T6.contextbackground.fillStyle = "#000022";
  T6.contextbackground.fillRect(0, 0, T6.width, T6.height); //"ClearRect" by painting background color

  //render Sun at center
  T6.contextbackground.beginPath();
  T6.contextbackground.arc(
    T6.width / 2 + 6 - offsetPlanetsX,
    T6.height / 2 + 10,
    10,
    0,
    2 * Math.PI,
    true
  );
  T6.contextbackground.fillStyle = "yellow";
  T6.contextbackground.fill();
  T6.contextbackground.closePath();
}

//RENDER FOREGROUND. INCLUDES ALL DYNAMIC ELEMENTS ON SCREEN.
function renderForeground_T6() {
  //Clear the canvas (otherwise there will be "ghosting" on foreground layer)
  T6.contextforeground.clearRect(0, 0, T6.width, T6.height);
  let planetLoc = [
    {
      planet: "Mercury",
      x: T6.width / 2 + T6.xMercury * T6.scale,
      y: T6.height / 2 - T6.yMercury * T6.scale,
      radius: 12,
      id: "mercury-icon"
    },
    {
      planet: "Venus",
      x: T6.width / 2 + T6.xVenus * T6.scale,
      y: T6.height / 2 - T6.yVenus * T6.scale,
      radius: 12,
      id: "venus-icon"
    },
    {
      planet: "Earth",
      x: T6.width / 2 + T6.xEarth * T6.scale,
      y: T6.height / 2 - T6.yEarth * T6.scale,
      radius: 18,
      id: "earth-icon"
    },
    {
      planet: "Mars",
      x: T6.width / 2 + T6.xMars * T6.scale,
      y: T6.height / 2 - T6.yMars * T6.scale,
      radius: 15,
      id: "mars-icon"
    },
    {
      planet: "Jupiter",
      x: T6.width / 2 + (T6.xJupiter * T6.scale) / T6.jupiterScaleDivider,
      y: T6.height / 2 - (T6.yJupiter * T6.scale) / T6.jupiterScaleDivider,
      radius: 20,
      id: "jupiter-icon"
    },
    {
      planet: "Saturn",
      x: T6.width / 2 + (T6.xSaturn * T6.scale) / T6.saturnScaleDivider,
      y: T6.height / 2 - (T6.ySaturn * T6.scale) / T6.saturnScaleDivider,
      radius: 27,
      id: "saturn-icon"
    },
    {
      planet: "Uranus",
      x: T6.width / 2 + (T6.xUranus * T6.scale) / T6.uranusScaleDivider,
      y: T6.height / 2 - (T6.yUranus * T6.scale) / T6.uranusScaleDivider,
      radius: 15,
      id: "uranus-icon"
    },
    {
      planet: "Neptune",
      x: T6.width / 2 + (T6.xNeptune * T6.scale) / T6.neptuneScaleDivider,
      y: T6.height / 2 - (T6.yNeptune * T6.scale) / T6.neptuneScaleDivider,
      radius: 10,
      id: "neptune-icon"
    }
  ];

  const load = () => {
    let c = document.getElementById("LAYER_FOREGROUND_T6");
    let ctx = c.getContext("2d");
    planetNames = [];

    for (let i = 0; i < planetLoc.length; i++) {
      planetNames.push({
        name: planetLoc[i].planet,
        x: planetLoc[i].x - offsetPlanetsX,
        y: planetLoc[i].y,
        radius: planetLoc[i].radius
      });
      let img = document.getElementById(planetLoc[i].id);
      ctx.drawImage(
        img,
        planetLoc[i].x - offsetPlanetsX,
        planetLoc[i].y,
        planetLoc[i].radius,
        planetLoc[i].radius
      );
    }
  };

  load();
  window.onload = load;
}

function getJulianDate_T6(Year, Month, Day) {
  let inputDate = new Date(Year, Month, Math.floor(Day));
  let switchDate = new Date("1582", "10", "15");

  let isGregorianDate = inputDate >= switchDate;

  //Adjust if B.C.
  if (Year < 0) {
    Year++;
  }

  //Adjust if JAN or FEB
  if (Month == 1 || Month == 2) {
    Year = Year - 1;
    Month = Month + 12;
  }

  //Calculate A & B; ONLY if date is equal or after 1582-Oct-15
  let A = Math.floor(Year / 100); //A
  let B = 2 - A + Math.floor(A / 4); //B

  //Ignore B if date is before 1582-Oct-15
  if (!isGregorianDate) {
    B = 0;
  }

  return (
    Math.floor(365.25 * Year) +
    Math.floor(30.6001 * (Month + 1)) +
    Day +
    1720994.5 +
    B
  );
}

function updatePlanetTime() {
  //1. Get Gregorian Date
  let timeUp = moment(
    chronoSphere.currentTime.utcOffset(chronoSphere.timezoneUTCHoursOffset)
  );
  timeUp.add(chronoSphere.mapTime);
  T6.current = timeUp.toDate();
  T6.DAY = T6.current.getDate();
  T6.MONTH = T6.current.getMonth() + 1; //January is 0!
  T6.YEAR = T6.current.getFullYear();
  //2. Get Julian Date
  T6.julianDate = getJulianDate_T6(T6.YEAR, T6.MONTH, T6.DAY);
  //3. Get Julian Centuries since Epoch (J2000)
  T6.T = (T6.julianDate - T6.julianEpochJ2000) / T6.julianCenturyInJulianDays;
}

function plotPlanet_T6(TGen, planetNumber) {
  //--------------------------------------------------------------------------------------------
  //1.
  //ORBIT SIZE
  //AU (CONSTANT = DOESN'T CHANGE)
  aGen =
    T6.planetElements[planetNumber][0] + T6.planetRates[planetNumber][0] * TGen;
  //2.
  //ORBIT SHAPE
  //ECCENTRICITY (CONSTANT = DOESN'T CHANGE)
  eGen =
    T6.planetElements[planetNumber][1] + T6.planetRates[planetNumber][1] * TGen;
  //--------------------------------------------------------------------------------------------
  //3.
  //ORBIT ORIENTATION
  //ORBITAL INCLINATION (CONSTANT = DOESN'T CHANGE)
  iGen =
    T6.planetElements[planetNumber][2] + T6.planetRates[planetNumber][2] * TGen;
  iGen = iGen % 360;
  //4.
  //ORBIT ORIENTATION
  //LONG OF ASCENDING NODE (CONSTANT = DOESN'T CHANGE)
  WGen =
    T6.planetElements[planetNumber][5] + T6.planetRates[planetNumber][5] * TGen;
  WGen = WGen % 360;
  //5.
  //ORBIT ORIENTATION
  //LONGITUDE OF THE PERIHELION
  wGen =
    T6.planetElements[planetNumber][4] + T6.planetRates[planetNumber][4] * TGen;
  wGen = wGen % 360;
  if (wGen < 0) {
    wGen = 360 + wGen;
  }
  //--------------------------------------------------------------------------------------------
  //6.
  //ORBIT POSITION
  //MEAN LONGITUDE (DYNAMIC = CHANGES OVER TIME)
  LGen =
    T6.planetElements[planetNumber][3] + T6.planetRates[planetNumber][3] * TGen;
  LGen = LGen % 360;
  if (LGen < 0) {
    LGen = 360 + LGen;
  }

  //MEAN ANOMALY --> Use this to determine Perihelion (0 degrees = Perihelion of planet)
  MGen = LGen - wGen;
  if (MGen < 0) {
    MGen = 360 + MGen;
  }

  //ECCENTRIC ANOMALY
  EGen = EccAnom_T6(eGen, MGen, 6);

  //ARGUMENT OF TRUE ANOMALY
  trueAnomalyArgGen =
    Math.sqrt((1 + eGen) / (1 - eGen)) * Math.tan(toRadians_T6(EGen) / 2);

  //TRUE ANOMALY (DYNAMIC = CHANGES OVER TIME)
  K = Math.PI / 180.0; //Radian converter letiable
  if (trueAnomalyArgGen < 0) {
    nGen = 2 * (Math.atan(trueAnomalyArgGen) / K + 180); //ATAN = ARCTAN = INVERSE TAN
  } else {
    nGen = 2 * (Math.atan(trueAnomalyArgGen) / K);
  }
  //--------------------------------------------------------------------------------------------

  //CALCULATE RADIUS VECTOR
  rGen = aGen * (1 - eGen * Math.cos(toRadians_T6(EGen)));

  //TAKEN FROM: http://www.stargazing.net/kepler/ellipse.html
  //CREDIT: Keith Burnett
  //Used to determine Heliocentric Ecliptic Coordinates
  xGen =
    rGen *
    (Math.cos(toRadians_T6(WGen)) * Math.cos(toRadians_T6(nGen + wGen - WGen)) -
      Math.sin(toRadians_T6(WGen)) *
        Math.sin(toRadians_T6(nGen + wGen - WGen)) *
        Math.cos(toRadians_T6(iGen)));
  yGen =
    rGen *
    (Math.sin(toRadians_T6(WGen)) * Math.cos(toRadians_T6(nGen + wGen - WGen)) +
      Math.cos(toRadians_T6(WGen)) *
        Math.sin(toRadians_T6(nGen + wGen - WGen)) *
        Math.cos(toRadians_T6(iGen)));
  zGen =
    rGen *
    (Math.sin(toRadians_T6(nGen + wGen - WGen)) * Math.sin(toRadians_T6(iGen)));

  return [xGen, yGen];
}

//TAKEN FROM: http://www.jgiesen.de/kepler/kepler.html
//CREDIT: Juergen Giesen
//Used to solve for E
function EccAnom_T6(ec, m, dp) {
  // arguments:
  // ec=eccentricity, m=mean anomaly,
  // dp=number of decimal places

  let pi = Math.PI,
    K = pi / 180.0;
  let maxIter = 30,
    i = 0;
  let delta = Math.pow(10, -dp);
  let E, F;

  m = m / 360.0;
  m = 2.0 * pi * (m - Math.floor(m));

  if (ec < 0.8) E = m;
  else E = pi;

  F = E - ec * Math.sin(m) - m;

  while (Math.abs(F) > delta && i < maxIter) {
    E = E - F / (1.0 - ec * Math.cos(E));
    F = E - ec * Math.sin(E) - m;
    i = i + 1;
  }

  E = E / K;

  return Math.round(E * Math.pow(10, dp)) / Math.pow(10, dp);
}

function toRadians_T6(deg) {
  return deg * (Math.PI / 180);
}

function round_T6(value, decimals) {
  return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
}

function displayToolTip(e) {
  e.preventDefault();
  e.stopPropagation();

  let canvasTXT = T6.canvasforeground.getContext("2d");
  canvasTXT.fillStyle = "#f7f4ef";
  canvasTXT.font = "17px 'Open Sans'";

  let mouseX = parseInt(e.clientX - offsetX);
  let mouseY = parseInt(e.clientY - offsetY);

  renderForeground_T6();

  for (let i = 0; i < planetNames.length; i++) {
    let h = planetNames[i];
    let dx = mouseX - h.x;
    let dy = mouseY - h.y;
    let adjustedX = h.x + 2 + h.radius;
    let adjustedY = h.y + 0 + h.radius * 0.9;
    let sunX = T6.width / 2 + 6 - offsetPlanetsX;
    let sunY = T6.height / 2 + 10;

    if (dx * dx + dy * dy < h.radius * h.radius) {
      if (
        sunX - 50 < adjustedX &&
        adjustedX < sunX + 0 &&
        sunY - 20 < adjustedY &&
        adjustedY < sunY
      )
        adjustedY -= 18;
      if (
        sunX - 50 < adjustedX &&
        adjustedX < sunX + 0 &&
        sunY < adjustedY &&
        adjustedY < sunY + 20
      )
        adjustedY += 18;

      canvasTXT.fillText(h.name, adjustedX, adjustedY);
    }
  }
}

chronoSphere.addInitFunction(initPlanets);

chronoSphere.addUpdateFunction(runPlanets);
