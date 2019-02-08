## Summary
Chronosphere is an initial attempt to represent different kinds of information about the Earth and the solar system, at any given point in time. The visuals are intended to be informative rather than literally accurate while leaning towards reality when possible. For instance, the positions of the planets are correct but some of them have been brought closer to the sun to fit in the model.

## Architecture
Chronosphere is built around a [singleton](https://en.wikipedia.org/wiki/Singleton_pattern) object named chronoSphere. "Temporal widgets", like moon phases and solar system orbits, are modules attached to the chronoSphere object. The time selector and map of the Earth is not currently factored as an independent module. HTML scaffolding also has to be added manually at this point.

Code taken from various opensource projects are combined, and to varying degrees, refactored. Time calculations are done with the [MomentJS Library](https://momentjs.com) using the present date and an offset to the time being displayed.

I believe it makes sense to keep all the widgets containerized and not to share dependencies (for things like astronomical calculations) as the additional code is minimal, doing so avoids race conditions, and it allows for more flexible configuration.

## Known Inaccuracies
The timezone selector is sometimes off in some timezones, due to daylight savings time not being factored in yet.

The solar terminator is not sized correctly at all zoom levels, the gradient is off, and there are sometimes seams between the map tiles.

The size of the planets is not proportioned accurately, nor are their orbits. This inaccuracy is intentional: it is impossible to display the correct proportions on any reasonably available screen.

## Build Steps
1. Run "npm install" in shell to download the Node packages
2. Run "npm run build" for a production build or "npm run dev" for a development build that will watch for changes

## Pull Requests
The project is still at a very initial stage and pull requests are very welcome.

## Todo
### General
* Write tests
* Improve plugin system to better modulize temporal widgets. Develop layout systems to remove the need for HTML scaffolds. 
* Improve mobile suppport

### Time management
* Improve timezone selector

### Satalite Map
* Improve the accuracy of the solar terminator. At any zoom level, it should be a linear gradient 55 km wide.
* Pansharpen night time raster and increase zoom level
* Show eclipses

### Additional Temporal Widgets
* Solar weather (Note: use [this source of data](https://www.spaceweatherlive.com) if avalible at selected time). Ideally the sun in the present orrery can be replaced with an image representing the solar weather at that time.
* [Time Magizine covers](http://content.time.com/time/coversearch/), see [this tutorial](https://www.pyimagesearch.com/2015/10/12/scraping-images-with-python-and-scrapy/)
* Significant events of the day  from Wikipedia
* [Add constellations](https://github.com/slowe/VirtualSky). This will require some sort of widget to choose the location the sky's seen from.
* Stock market data
* Marine and aviation traffic

## Credits
* The map is built on top of [Leaflet](https://leafletjs.com)
* The daytime satellite images and all the satellite image hosting is provided by [MapBox](https://www.mapbox.com/)
* The nighttime satellite images are from [NASA's Black Marble project](https://earthobservatory.nasa.gov/Features/NightLights/page3.php)
* The SVGs in the time controls are from [Feather Icons](https://feathericons.com/)
* The code to calculate the solar terminator is from [Leaflet.Terminator](https://github.com/joergdietrich/Leaflet.Terminator/)
* The code for drawing the solar terminator is adapted from [Leaflet Boundary Canvas](https://github.com/aparshin/leaflet-boundary-canvas)
* The phase of the moon is calculated with Vladimir Agafonkin [sunCalc library](https://github.com/mourner/suncalc)
* The code for calculating the position of the planets is from Chris Jager's [Planetary Orbits](http://www.planetaryorbits.com/tutorial-javascript-orbit-simulation.html)
* [MomentJS](https://momentjs.com) is used for time calculations
* [Flatpickr](https://flatpickr.js.org) is used to select dates
* The SVG's for Venus, Earth, Mars, Jupiter, and Neptune were adapted from the [Tango Desktop project](http://tango.freedesktop.org/Tango_Desktop_Project), Saturn is from [Wikipedia](https://commons.wikimedia.org/wiki/File:Saturn-148300.svg), as is [Uranus](https://commons.wikimedia.org/wiki/File:Uranus2-by_Merlin2525.svg), and [Saturn](https://commons.wikimedia.org/wiki/File:Saturn.svg)
* The planet glyphs are from [Wikipedia](https://en.wikipedia.org/wiki/Astronomical_symbols#Symbols_for_the_planets)
* The JPG's currently in use, for lunar phase, were uploaded by Jay Tanner to [WikiCommons](https://commons.wikimedia.org/wiki/Category:Lunar_phases)

### NPM and WebPack Plugins:
[autoprefixer](https://www.npmjs.com/package/autoprefixer),[babel-core](https://www.npmjs.com/package/babel-core),[babel-loader](https://www.npmjs.com/package/babel-loader),[babel-preset-env](https://www.npmjs.com/package/babel-preset-env),[file-loader](https://www.npmjs.com/package/file-loader),[css-loader](https://www.npmjs.com/package/css-loader),[mini-css-extract-plugin](https://www.npmjs.com/package/mini-css-extract-plugin),[node-sass](https://www.npmjs.com/package/node-sass),[postcss-loader](https://www.npmjs.com/package/postcss-loader),[sass-loader](https://www.npmjs.com/package/sass-loader),[style-loader](https://www.npmjs.com/package/style-loader),[webpack](https://www.npmjs.com/package/webpack),[webpack-cli](https://www.npmjs.com/package/webpack-cli)



*Released under the MIT License*