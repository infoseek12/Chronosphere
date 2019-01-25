/*
 (c) 2011-2015, Vladimir Agafonkin
 SunCalc is a JavaScript library for calculating sun/moon position and light phases.
 https://github.com/mourner/suncalc
*/

let moonCalc = {};

let moonStart = () => { 'use strict';

    // shortcuts for easier to read formulas

    let PI   = Math.PI,
        sin  = Math.sin,
        cos  = Math.cos,
        tan  = Math.tan,
        asin = Math.asin,
        atan = Math.atan2,
        acos = Math.acos,
        rad  = PI / 180;

    // sun calculations are based on http://aa.quae.nl/en/reken/zonpositie.html formulas


    // date/time constants and conversions

    let dayMs = 1000 * 60 * 60 * 24,
        J1970 = 2440588,
        J2000 = 2451545;

    function toJulian(date) { return date.valueOf() / dayMs - 0.5 + J1970; }
    function fromJulian(j)  { return new Date((j + 0.5 - J1970) * dayMs); }
    function toDays(date)   { return toJulian(date) - J2000; }


    // general calculations for position

    let e = rad * 23.4397; // obliquity of the Earth

    function rightAscension(l, b) { return atan(sin(l) * cos(e) - tan(b) * sin(e), cos(l)); }
    function declination(l, b)    { return asin(sin(b) * cos(e) + cos(b) * sin(e) * sin(l)); }

    function azimuth(H, phi, dec)  { return atan(sin(H), cos(H) * sin(phi) - tan(dec) * cos(phi)); }
    function altitude(H, phi, dec) { return asin(sin(phi) * sin(dec) + cos(phi) * cos(dec) * cos(H)); }

    function siderealTime(d, lw) { return rad * (280.16 + 360.9856235 * d) - lw; }

    function astroRefraction(h) {
        if (h < 0) // the following formula works for positive altitudes only.
            h = 0; // if h = -0.08901179 a div/0 would occur.

        // formula 16.4 of "Astronomical Algorithms" 2nd edition by Jean Meeus (Willmann-Bell, Richmond) 1998.
        // 1.02 / tan(h + 10.26 / (h + 5.10)) h in degrees, result in arc minutes -> converted to rad:
        return 0.0002967 / Math.tan(h + 0.00312536 / (h + 0.08901179));
    }

    // general sun calculations

    function solarMeanAnomaly(d) { return rad * (357.5291 + 0.98560028 * d); }

    function eclipticLongitude(M) {

        let C = rad * (1.9148 * sin(M) + 0.02 * sin(2 * M) + 0.0003 * sin(3 * M)), // equation of center
            P = rad * 102.9372; // perihelion of the Earth

        return M + C + P + PI;
    }

    function sunCoords(d) {

        let M = solarMeanAnomaly(d),
            L = eclipticLongitude(M);

        return {
            dec: declination(L, 0),
            ra: rightAscension(L, 0)
        };
    }

    // calculates sun position for a given date and latitude/longitude

    moonCalc.getPosition = function (date, lat, lng) {

        let lw  = rad * -lng,
            phi = rad * lat,
            d   = toDays(date),

            c  = sunCoords(d),
            H  = siderealTime(d, lw) - c.ra;

        return {
            azimuth: azimuth(H, phi, c.dec),
            altitude: altitude(H, phi, c.dec)
        };
    }


    // sun times configuration (angle, morning name, evening name)

    let times = moonCalc.times = [
        [-0.833, 'sunrise',       'sunset'      ],
        [  -0.3, 'sunriseEnd',    'sunsetStart' ],
        [    -6, 'dawn',          'dusk'        ],
        [   -12, 'nauticalDawn',  'nauticalDusk'],
        [   -18, 'nightEnd',      'night'       ],
        [     6, 'goldenHourEnd', 'goldenHour'  ]
    ];

    // adds a custom time to the times config

    moonCalc.addTime = function (angle, riseName, setName) {
        times.push([angle, riseName, setName]);
    }


    // calculations for sun times

    let J0 = 0.0009;

    function julianCycle(d, lw) { return Math.round(d - J0 - lw / (2 * PI)); }

    function approxTransit(Ht, lw, n) { return J0 + (Ht + lw) / (2 * PI) + n; }
    function solarTransitJ(ds, M, L)  { return J2000 + ds + 0.0053 * sin(M) - 0.0069 * sin(2 * L); }

    function hourAngle(h, phi, d) { return acos((sin(h) - sin(phi) * sin(d)) / (cos(phi) * cos(d))); }

    // returns set time for the given sun altitude
    function getSetJ(h, lw, phi, dec, n, M, L) {

        let w = hourAngle(h, phi, dec),
            a = approxTransit(w, lw, n);
        return solarTransitJ(a, M, L);
    }


    // moon calculations, based on http://aa.quae.nl/en/reken/hemelpositie.html formulas

    function moonCoords(d) { // geocentric ecliptic coordinates of the moon

        let L = rad * (218.316 + 13.176396 * d), // ecliptic longitude
            M = rad * (134.963 + 13.064993 * d), // mean anomaly
            F = rad * (93.272 + 13.229350 * d),  // mean distance

            l  = L + rad * 6.289 * sin(M), // longitude
            b  = rad * 5.128 * sin(F),     // latitude
            dt = 385001 - 20905 * cos(M);  // distance to the moon in km

        return {
            ra: rightAscension(l, b),
            dec: declination(l, b),
            dist: dt
        };
    }

    moonCalc.getMoonPosition = function (date, lat, lng) {

        let lw  = rad * -lng,
            phi = rad * lat,
            d   = toDays(date),

            c = moonCoords(d),
            H = siderealTime(d, lw) - c.ra,
            h = altitude(H, phi, c.dec),
            // formula 14.1 of "Astronomical Algorithms" 2nd edition by Jean Meeus (Willmann-Bell, Richmond) 1998.
            pa = atan(sin(H), tan(phi) * cos(c.dec) - sin(c.dec) * cos(H));

        h = h + astroRefraction(h); // altitude correction for refraction

        return {
            azimuth: azimuth(H, phi, c.dec),
            altitude: h,
            distance: c.dist,
            parallacticAngle: pa
        };
    }


    // calculations for illumination parameters of the moon,
    // based on http://idlastro.gsfc.nasa.gov/ftp/pro/astro/mphase.pro formulas and
    // Chapter 48 of "Astronomical Algorithms" 2nd edition by Jean Meeus (Willmann-Bell, Richmond) 1998.

    moonCalc.getMoonIllumination = function (date) {

        let d = toDays(date || new Date()),
            s = sunCoords(d),
            m = moonCoords(d),

            sdist = 149598000, // distance from Earth to Sun in km

            phi = acos(sin(s.dec) * sin(m.dec) + cos(s.dec) * cos(m.dec) * cos(s.ra - m.ra)),
            inc = atan(sdist * sin(phi), m.dist - sdist * cos(phi)),
            angle = atan(cos(s.dec) * sin(s.ra - m.ra), sin(s.dec) * cos(m.dec) -
                    cos(s.dec) * sin(m.dec) * cos(s.ra - m.ra));

        return {
            fraction: (1 + cos(inc)) / 2,
            phase: 0.5 + 0.5 * inc * (angle < 0 ? -1 : 1) / Math.PI,
            angle: angle
        };
    }


    function hoursLater(date, h) {
        return new Date(date.valueOf() + h * dayMs / 24);
    }

}

let updateMoon = () => {
  let timeUp = moment(chronoSphere.currentTime);
  timeUp = timeUp.add(chronoSphere.mapTime);
  let moonIMG = document.getElementById("moon");
  moonIMG.src = "./assets/img/moon/jpg/" + parseInt((moonCalc.getMoonIllumination(timeUp).phase * 35) + 1) + ".jpg";
}

chronoSphere.addInitFunction(moonStart);

chronoSphere.addUpdateFunction(updateMoon);