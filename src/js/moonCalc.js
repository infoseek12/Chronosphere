/*
 (c) 2011-2015, Vladimir Agafonkin
 SunCalc is a JavaScript library for calculating sun/moon position and light phases.
 https://github.com/mourner/suncalc
*/

let getMoonIllumination;

const moonStart = () => {
  // shortcuts for easier to read formulas

  const PI = Math.PI,
    sin = Math.sin,
    cos = Math.cos,
    tan = Math.tan,
    asin = Math.asin,
    atan = Math.atan2,
    acos = Math.acos,
    rad = PI / 180;

  // Sun calculations are based on http://aa.quae.nl/en/reken/zonpositie.html formulas

  // Date/time constants and conversions

  const dayMs = 1000 * 60 * 60 * 24,
    J1970 = 2440588,
    J2000 = 2451545;

  const getJulian = date => date.valueOf() / dayMs - 0.5 + J1970;

  const toDays = date => getJulian(date) - J2000;

  // General calculations for position

  const e = rad * 23.4397; // obliquity of the Earth

  const rightAscension = (l, b) => atan(sin(l) * cos(e) - tan(b) * sin(e), cos(l));

  const declination = (l, b) => asin(sin(b) * cos(e) + cos(b) * sin(e) * sin(l));

  // General sun calculations

  const solarMeanAnomaly = d => rad * (357.5291 + 0.98560028 * d);

  const eclipticLongitude = M => {
    const C = rad * (1.9148 * sin(M) + 0.02 * sin(2 * M) + 0.0003 * sin(3 * M)); // equation of center
    const P = rad * 102.9372; // perihelion of the Earth

    return M + C + P + PI;
  };

  const sunCoords = d => {
    const M = solarMeanAnomaly(d);
    const L = eclipticLongitude(M);

    return {
      dec: declination(L, 0),
      ra: rightAscension(L, 0)
    };
  };

  // Moon calculations, based on http://aa.quae.nl/en/reken/hemelpositie.html formulas

  const moonCoords = d => {
    // geocentric ecliptic coordinates of the moon

    const L = rad * (218.316 + 13.176396 * d), // ecliptic longitude
      M = rad * (134.963 + 13.064993 * d), // mean anomaly
      F = rad * (93.272 + 13.22935 * d), // mean distance
      l = L + rad * 6.289 * sin(M), // longitude
      b = rad * 5.128 * sin(F), // latitude
      dt = 385001 - 20905 * cos(M); // distance to the moon in km

    return {
      ra: rightAscension(l, b),
      dec: declination(l, b),
      dist: dt
    };
  };

  // calculations for illumination parameters of the moon,
  // based on http://idlastro.gsfc.nasa.gov/ftp/pro/astro/mphase.pro formulas and
  // Chapter 48 of "Astronomical Algorithms" 2nd edition by Jean Meeus (Willmann-Bell, Richmond) 1998.

  getMoonIllumination = date => {
    const d = toDays(date || new Date()),
      s = sunCoords(d),
      m = moonCoords(d),
      sdist = 149598000, // distance from Earth to Sun in km
      phi = acos(sin(s.dec) * sin(m.dec) + cos(s.dec) * cos(m.dec) * cos(s.ra - m.ra)),
      inc = atan(sdist * sin(phi), m.dist - sdist * cos(phi)),
      angle = atan(
        cos(s.dec) * sin(s.ra - m.ra),
        sin(s.dec) * cos(m.dec) - cos(s.dec) * sin(m.dec) * cos(s.ra - m.ra)
      );

    return 0.5 + (0.5 * inc * (angle < 0 ? -1 : 1)) / Math.PI;
  };
};

const updateMoon = () => {
  const timeUp = moment(chronoSphere.currentTime).add(chronoSphere.mapTime);
  const moonIMG = document.getElementById('moon');
  moonIMG.src =
    './assets/img/moon/jpg/' + parseInt(getMoonIllumination(timeUp) * 35 + 1, 10) + '.jpg';
};

chronoSphere.addInitFunction(moonStart);

chronoSphere.addUpdateFunction(updateMoon);
