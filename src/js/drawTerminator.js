// calculates erminator and day/night regions on a Leaflet map
const terminator = L.Polygon.extend({
  initialize: function initialize(time) {
    this._R2D = 180 / Math.PI;
    this._D2R = Math.PI / 180;

    L.Util.setOptions(this, time);
    const latLng = this._compute(this.options.time);
    this.setLatLngs(latLng);
  },

  _sunEclipticPosition: function _sunEclipticPosition(julianDay) {
    // Compute the position of the Sun in ecliptic coordinates at julianDay.
    // Following http://en.wikipedia.org/wiki/Position_of_the_Sun

    // Days since start of J2000.0
    const n = julianDay - 2451545.0;
    // Mean longitude of the Sun
    const L = (280.46 + 0.9856474 * n) % 360;
    // Mean anomaly of the Sun
    const g = (357.528 + 0.9856003 * n) % 360;
    // Ecliptic longitude of Sun
    const lambda = L + 1.915 * Math.sin(g * this._D2R) + 0.02 * Math.sin(2 * g * this._D2R);
    // Distance from Sun in AU
    const R = 1.00014 - 0.01671 * Math.cos(g * this._D2R) - 0.0014 * Math.cos(2 * g * this._D2R);
    return {
      lambda: lambda,
      R: R
    };
  },

  _eclipticObliquity: function _eclipticObliquity(julianDay) {
    // Following the short term expression in
    // http://en.wikipedia.org/wiki/Axial_tilt#Obliquity_of_the_ecliptic_.28Earth.27s_axial_tilt.29
    const n = julianDay - 2451545.0;
    // Julian centuries since J2000.0
    const T = n / 36525;
    const epsilon =
      23.43929111 -
      T *
        (46.836769 / 3600 -
          T *
            (0.0001831 / 3600 +
              T * (0.0020034 / 3600 - T * (0.576e-6 / 3600 - (T * 4.34e-8) / 3600))));
    return epsilon;
  },

  _sunEquatorialPosition: function _sunEquatorialPosition(sunEclLng, eclObliq) {
    // Compute the Sun's equatorial position from its ecliptic position.
    // Inputs are expected in degrees. Outputs are in degrees as well.
    const alpha =
      Math.atan(Math.cos(eclObliq * this._D2R) * Math.tan(sunEclLng * this._D2R)) * this._R2D;
    const delta =
      Math.asin(Math.sin(eclObliq * this._D2R) * Math.sin(sunEclLng * this._D2R)) * this._R2D;

    const lQuadrant = Math.floor(sunEclLng / 90) * 90;
    const raQuadrant = Math.floor(alpha / 90) * 90;

    return {
      alpha: alpha + (lQuadrant - raQuadrant),
      delta: delta
    };
  },

  _hourAngle: function _hourAngle(lng, sunPos, gst) {
    // Compute the hour angle of the sun for a longitude on Earth. Return the hour angle in degrees.
    const lst = gst + lng / 15;
    return lst * 15 - sunPos.alpha;
  },

  _latitude: function _latitude(ha, sunPos) {
    // For a given hour angle and sun position, compute the latitude of the terminator in degrees.
    return Math.atan(-Math.cos(ha * this._D2R) / Math.tan(sunPos.delta * this._D2R)) * this._R2D;
  },

  _compute: function _compute(time) {
    const today = new Date(time);
    const julianDay = today.getJulian();
    const gst = today.getGMST();

    const sunEclPos = this._sunEclipticPosition(julianDay);
    const eclObliq = this._eclipticObliquity(julianDay);
    const sunEqPos = this._sunEquatorialPosition(sunEclPos.lambda, eclObliq);

    const latLng = [];
    let ha, lat, lng;

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

computeTerminator = function Lterminator(time) {
  return new terminator(time)._latlngs;
};

//Displays terminator and twilight gradient
const ExtendMethods = {
  _toMercGeometry: function toMercGeometry(b) {
    let p;
    const mercRing = [];

    for (p = 0; p < b[0].length; p++) {
      mercRing.push(this._map.project(b[0][p], 0));
    }

    return mercRing;
  },

  // Calculates intersection of original boundary geometry and tile boundary.
  // Uses quadtree as cache to speed-up intersection.
  // Returns {geometry: <LatLng[][][]>}
  _getTileGeometry: function getTileGeometry(x, y, z) {
    const cacheID = x + ':' + y + ':' + z,
      zCoeff = Math.pow(2, z),
      cache = this._boundaryCache;

    if (cache[cacheID]) {
      return cache[cacheID];
    }

    const mercBoundary = this._toMercGeometry(this.options.boundary);

    if (z === 0) {
      cache[cacheID] = {
        geometry: mercBoundary
      };
      return cache[cacheID];
    }

    const ts = chronoSphere.tileSize;
    const tileBbox = new L.Bounds(
      new L.Point((x * ts) / zCoeff, (y * ts) / zCoeff),
      new L.Point(((x + 1) * ts) / zCoeff, ((y + 1) * ts) / zCoeff)
    );

    const parentState = this._getTileGeometry(Math.floor(x / 2), Math.floor(y / 2), z - 1);

    cache[cacheID] = {
      geometry: L.PolyUtil.clipPolygon(parentState.geometry, tileBbox)
    };
    return cache[cacheID];
  },

  _drawTileInternal: function drawTileInternal(canvas, tilePoint, url, callback) {
    const zoom = this._getZoomForUrl();
    const state = this._getTileGeometry(tilePoint.x, tilePoint.y, zoom);

    const ts = chronoSphere.tileSize,
      tileX = ts * tilePoint.x,
      tileY = ts * tilePoint.y,
      zCoeff = Math.pow(2, zoom),
      ctx = canvas.getContext('2d'),
      imageObj = new Image(),
      geom = state.geometry;

    if (geom.length <= 15) {
      callback();
    }

    const setPattern = function setPattern() {
      const reverseTerminator = chronoSphere.southernSun ? -1 : 1;
      const terminatorClip = { x: [], y: [] };

      ctx.beginPath();

      if (geom.length === 0) {
        return;
      }

      ctx.moveTo(geom[0].x * zCoeff - tileX, geom[0].y * zCoeff - tileY);

      for (let p = 1; p < geom.length; p++) {
        const outX = geom[p].x * zCoeff - tileX;
        const outY = geom[p].y * zCoeff - tileY;

        ctx.lineTo(outX, outY);

        if (outX !== 0 && outY !== 0) {
          terminatorClip.x.push(outX);
          terminatorClip.y.push(outY);
        }
      }

      ctx.clip();

      ctx.globalCompositeOperation = 'lighten';
      ctx.lineCap = 'round';
      if (geom.length > 4 && chronoSphere.showTerminator === true) {
        ctx.beginPath();
        for (let o = 1; o < 12; o++) {
          ctx.strokeStyle = 'rgba(5, 4, 16, ' + 0.0075 * o + ')';
          ctx.lineWidth = o * (zCoeff / 2) * 0.5;
          ctx.moveTo(terminatorClip.x[1], terminatorClip.y[1] + reverseTerminator * o);

          for (let p = 2; p <= terminatorClip.x.length; p++) {
            if (Math.abs(terminatorClip.x[p] - terminatorClip.x[p + 1]) > 10) {
              ctx.stroke();
              p += 1;
              ctx.beginPath();
              ctx.moveTo(terminatorClip.x[p], terminatorClip.y[p] + reverseTerminator * o);
              p += 1;
              continue;
            }
            ctx.lineTo(terminatorClip.x[p], terminatorClip.y[p] + reverseTerminator * o);
          }
          ctx.stroke();
        }
      }

      ctx.globalCompositeOperation = 'source-out';
      ctx.beginPath();
      ctx.rect(0, 0, ts, ts);
      ctx.fillStyle = ctx.createPattern(imageObj, 'repeat');
      ctx.fill();

      callback();
    };

    if (this.options.crossOrigin) {
      imageObj.crossOrigin = '';
    }

    imageObj.onload = () => setPattern();

    imageObj.src = url;
  },

  onAdd: function(map) {
    (L.TileLayer.Canvas || L.TileLayer).prototype.onAdd.call(this, map);
  },

  onRemove: function(map) {
    (L.TileLayer.Canvas || L.TileLayer).prototype.onRemove.call(this, map);
  }
};

L.TileLayer.BoundaryCanvas = L.TileLayer.extend({
  includes: ExtendMethods,
  initialize: function(url, options) {
    L.TileLayer.prototype.initialize.call(this, url, options);
    this._boundaryCache = {}; //Cache index "x:y:z"
  },
  createTile: function(coords, done) {
    const tile = document.createElement('canvas');
    const url = this.getTileUrl(coords);
    tile.width = tile.height = chronoSphere.tileSize;
    this._drawTileInternal(tile, coords, url, L.bind(done, null, null, tile));
    return tile;
  }
});

L.TileLayer.boundaryCanvas = function boundaryCanvas(url, options) {
  return new L.TileLayer.BoundaryCanvas(url, options);
};

const displayNightImagery = () => {
  chronoSphere.nightTimeMap = L.TileLayer.boundaryCanvas(
    'https://api.mapbox.com/styles/v1/infoseek/cjf4g08rk19me2sp368t2lhvg/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaW5mb3NlZWsiLCJhIjoiY2pkajV6OXFtMWpqaDMzcGdyaGh6cjJ2NiJ9.ARSABTSiSWmuSQA2fbpzUw',
    {
      boundary: computeTerminator({ time: chronoSphere.currentTime.add(chronoSphere.mapTime) })
    }
  ).addTo(chronoSphere.map);
};

const updateTerminator = () => {
  const oldLayer = chronoSphere.nightTimeMap;
  let tileLoadCounter = 0;

  const deleteLayer = () => {
    tileLoadCounter += 1;
    if (tileLoadCounter === 14) {
      setTimeout(() => {
        chronoSphere.map.removeLayer(oldLayer);
      }, 250);
    }
  };

  chronoSphere.nightTimeMap = L.TileLayer.boundaryCanvas(
    'https://api.mapbox.com/styles/v1/infoseek/cjf4g08rk19me2sp368t2lhvg/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaW5mb3NlZWsiLCJhIjoiY2pkajV6OXFtMWpqaDMzcGdyaGh6cjJ2NiJ9.ARSABTSiSWmuSQA2fbpzUw',
    {
      boundary: computeTerminator({ time: chronoSphere.currentTime.add(chronoSphere.mapTime) })
    }
  )
    .addTo(chronoSphere.map)
    .on('tileload', deleteLayer);
};

chronoSphere.addInitFunction(displayNightImagery);

chronoSphere.addUpdateFunction(updateTerminator);
