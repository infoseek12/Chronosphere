//Displays terminator and twilight gradient
let ExtendMethods = {
  _toMercGeometry: function(b) {
    let p,
      mercRing = [];

    for (p = 0; p < b[0].length; p++) {
      mercRing.push(this._map.project(b[0][p], 0));
    }

    return mercRing;
  },

  // Calculates intersection of original boundary geometry and tile boundary.
  // Uses quadtree as cache to speed-up intersection.
  // Returns {geometry: <LatLng[][][]>}
  _getTileGeometry: function(x, y, z) {
    let cacheID = x + ":" + y + ":" + z,
      zCoeff = Math.pow(2, z),
      parentState,
      cache = this._boundaryCache;

    if (cache[cacheID]) {
      return cache[cacheID];
    }

    let mercBoundary = this._toMercGeometry(this.options.boundary),
      ts = chronoSphere.tileSize,
      tileBbox = new L.Bounds(
        new L.Point((x * ts) / zCoeff, (y * ts) / zCoeff),
        new L.Point(((x + 1) * ts) / zCoeff, ((y + 1) * ts) / zCoeff)
      );

    if (z === 0) {
      cache[cacheID] = {
        geometry: mercBoundary
      };
      return cache[cacheID];
    }

    parentState = this._getTileGeometry(
      Math.floor(x / 2),
      Math.floor(y / 2),
      z - 1
    );

    cache[cacheID] = {
      geometry: L.PolyUtil.clipPolygon(parentState.geometry, tileBbox)
    };
    return cache[cacheID];
  },

  _drawTileInternal: function(canvas, tilePoint, url, callback) {
    let zoom = this._getZoomForUrl(),
      state = this._getTileGeometry(tilePoint.x, tilePoint.y, zoom);

    let ts = chronoSphere.tileSize,
      tileX = ts * tilePoint.x,
      tileY = ts * tilePoint.y,
      zCoeff = Math.pow(2, zoom),
      ctx = canvas.getContext("2d"),
      imageObj = new Image();

    let setPattern = function() {
      let reverseTerminator = chronoSphere.southernSun ? -1 : 1;
      let p, pattern, geom;
      let terminatorClip = {
        x: [],
        y: []
      };

      geom = state.geometry;

      ctx.beginPath();

      if (geom.length == 0) {
        return;
      }

      ctx.moveTo(geom[0].x * zCoeff - tileX, geom[0].y * zCoeff - tileY);

      for (p = 1; p < geom.length; p++) {
        let outX = geom[p].x * zCoeff - tileX;
        let outY = geom[p].y * zCoeff - tileY;
        ctx.lineTo(outX, outY);

        if (outX != 0 && outY != 0) {
          terminatorClip.x.push(outX);
          terminatorClip.y.push(outY);
        }
      }

      ctx.clip();

      ctx.globalCompositeOperation = "lighten";
      ctx.lineCap = "round";
      if (geom.length > 4 && chronoSphere.showTerminator == true) {
        ctx.beginPath();
        for (let o = 1; o < 12; o++) {
          ctx.strokeStyle = "rgba(5, 4, 16, " + 0.01 * o + ")";
          ctx.lineWidth = o * (zCoeff / 2) * 0.5;
          ctx.moveTo(
            terminatorClip.x[1],
            terminatorClip.y[1] + reverseTerminator * o
          );

          for (let p = 2; p <= terminatorClip.x.length; p++) {
            if (Math.abs(terminatorClip.x[p] - terminatorClip.x[p + 1]) > 10) {
              ctx.stroke();
              p += 1;
              ctx.beginPath();
              ctx.moveTo(
                terminatorClip.x[p],
                terminatorClip.y[p] + reverseTerminator * o
              );
              p += 1;
              continue;
            }
            ctx.lineTo(
              terminatorClip.x[p],
              terminatorClip.y[p] + reverseTerminator * o
            );
          }
          ctx.stroke();
        }
      }

      ctx.globalCompositeOperation = "source-out";
      pattern = ctx.createPattern(imageObj, "repeat");
      ctx.beginPath();
      ctx.rect(0, 0, ts, ts);
      ctx.fillStyle = pattern;
      ctx.fill();

      callback();
    };

    if (this.options.crossOrigin) {
      imageObj.crossOrigin = "";
    }

    imageObj.onload = function() {
      setTimeout(setPattern, 0); //IE9 Bug - Black tiles appear randomly if setPattern() is called without a timeout
    };

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
    let tile = document.createElement("canvas"),
      url = this.getTileUrl(coords);
    tile.width = tile.height = chronoSphere.tileSize;
    this._drawTileInternal(tile, coords, url, L.bind(done, null, null, tile));
    return tile;
  }
});

L.TileLayer.boundaryCanvas = function(url, options) {
  return new L.TileLayer.BoundaryCanvas(url, options);
};

L.TileLayer.BoundaryCanvas.createFromLayer = function(layer, options) {
  return new L.TileLayer.BoundaryCanvas(
    layer._url,
    L.extend({}, layer.options, options)
  );
};

let updateTerminator = () => {
  let timeUp = moment(chronoSphere.currentTime);
  timeUp = timeUp.add(chronoSphere.mapTime);

  let nightTime2 = L.TileLayer.BoundaryCanvas.createFromLayer(
    chronoSphere.nightTimeMap,
    {
      opacity: 0.9,
      boundary: L.terminator({ time: timeUp })
    }
  ).addTo(chronoSphere.map);

  let chronUp = () => {
    chronoSphere.map.removeLayer(chronoSphere.nightTimeMap);
    chronoSphere.nightTimeMap = nightTime2;
  };

  setTimeout(chronUp, 500);
};

chronoSphere.addUpdateFunction(updateTerminator);
