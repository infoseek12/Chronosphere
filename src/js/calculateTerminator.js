// Terminator.js -- Overlay day/night region on a Leaflet map
L.Terminator = L.Polygon.extend({
  options: {},
  initialize: function(options) {
    this._R2D = 180 / Math.PI;
    this._D2R = Math.PI / 180;
    L.Util.setOptions(this, options);
    let latLng = this._compute(this.options.time || new Date());
    this.setLatLngs(latLng);
  },

  _sunEclipticPosition: function(julianDay) {
    // Compute the position of the Sun in ecliptic coordinates at julianDay.
    // Following http://en.wikipedia.org/wiki/Position_of_the_Sun

    // Days since start of J2000.0
    let n = julianDay - 2451545.0;
    // Mean longitude of the Sun
    let L = 280.46 + 0.9856474 * n;
    L %= 360;
    // Mean anomaly of the Sun
    let g = 357.528 + 0.9856003 * n;
    g %= 360;
    // Ecliptic longitude of Sun
    let lambda =
      L + 1.915 * Math.sin(g * this._D2R) + 0.02 * Math.sin(2 * g * this._D2R);
    // Distance from Sun in AU
    let R =
      1.00014 -
      0.01671 * Math.cos(g * this._D2R) -
      0.0014 * Math.cos(2 * g * this._D2R);
    return {
      lambda: lambda,
      R: R
    };
  },

  _eclipticObliquity: function(julianDay) {
    // Following the short term expression in
    // http://en.wikipedia.org/wiki/Axial_tilt#Obliquity_of_the_ecliptic_.28Earth.27s_axial_tilt.29
    let n = julianDay - 2451545.0;
    // Julian centuries since J2000.0
    let T = n / 36525;
    let epsilon =
      23.43929111 -
      T *
        (46.836769 / 3600 -
          T *
            (0.0001831 / 3600 +
              T *
                (0.0020034 / 3600 -
                  T * (0.576e-6 / 3600 - (T * 4.34e-8) / 3600))));
    return epsilon;
  },

  _sunEquatorialPosition: function(sunEclLng, eclObliq) {
    // Compute the Sun's equatorial position from its ecliptic position.
    // Inputs are expected in degrees. Outputs are in degrees as well.
    let alpha =
      Math.atan(
        Math.cos(eclObliq * this._D2R) * Math.tan(sunEclLng * this._D2R)
      ) * this._R2D;
    let delta =
      Math.asin(
        Math.sin(eclObliq * this._D2R) * Math.sin(sunEclLng * this._D2R)
      ) * this._R2D;

    let lQuadrant = Math.floor(sunEclLng / 90) * 90;
    let raQuadrant = Math.floor(alpha / 90) * 90;
    alpha = alpha + (lQuadrant - raQuadrant);

    return {
      alpha: alpha,
      delta: delta
    };
  },

  _hourAngle: function(lng, sunPos, gst) {
    // Compute the hour angle of the sun for a longitude on Earth. Return the hour angle in degrees.
    let lst = gst + lng / 15;
    return lst * 15 - sunPos.alpha;
  },

  _latitude: function(ha, sunPos) {
    // For a given hour angle and sun position, compute the latitude of the terminator in degrees.
    let lat =
      Math.atan(
        -Math.cos(ha * this._D2R) / Math.tan(sunPos.delta * this._D2R)
      ) * this._R2D;
    return lat;
  },

  _compute: function(time) {
    let today = new Date(time);
    let julianDay = today.getJulian();
    let gst = today.getGMST();
    let ha,
      lat,
      lng,
      latLng = [];
    let sunEclPos = this._sunEclipticPosition(julianDay);
    let eclObliq = this._eclipticObliquity(julianDay);
    let sunEqPos = this._sunEquatorialPosition(sunEclPos.lambda, eclObliq);

    for (let i = 0; i <= 720 * chronoSphere.resolution; i++) {
      lng = -360 + i / chronoSphere.resolution;
      ha = this._hourAngle(lng, sunEqPos, gst);
      lat = this._latitude(ha, sunEqPos);
      latLng[i + 1] = [lat, lng];
    }

    if (sunEqPos.delta < 0) {
      chronoSphere.southernSun = true;
      latLng[0] = [90, -360];
      latLng[latLng.length] = [90, 360];
    } else {
      latLng[0] = [-90, -360];
      latLng[latLng.length] = [-90, 360];
    }

    return latLng;
  }
});

L.terminator = function(options) {
  return new L.Terminator(options)._latlngs;
};
