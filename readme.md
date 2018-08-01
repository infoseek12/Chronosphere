###Summary
***
Chrono-Sphere is an initial attempt to represent different kinds of information about Earth, and the solar system, at any given point in time. The visuals are intended to be informative rather than literally accurate while leaning towards reality when possible. However, where information is displayed the intent is to be accurate.

###"Architecture"
***
Chrono-Sphere is built around a [singleton](https://en.wikipedia.org/wiki/Singleton_pattern) object named chronoSphere. Temporal widgets, like moon phases and solar system orbits, are modules attached to the chronoSphere object. The primary map is not currently factored as an independent module.

Code taken from various opensource projects are combined, and to varying degrees, refactored (hopefully all are in the credits below, please let me know if I missed anyone). Updates are triggered every second and time calculations are done with the [MomentJS Library](https://momentjs.com). 

###"Accuracy"
***
##Known Inaccuracies
The timezone selector is sometimes off by an hour, I believe this is due to daylight savings time not being factored in.

The solar terminator is not sized correctly at all zoom levels, the gradient is off, and there are sometimes seams between the map tiles.

The size of the planets are not proportioned accurately, nor are their orbits. This inaccuracy is intentional: it is impossible to display the correct proportions on any reasonably available screen, and it would be impossible to see in any case.

###Pull Requests
***

###Present Priorities
***
Switch to Mapbox GL JS. The platform is based on WebGL and more performant; and current bugs, like seams in the terminator line between map tiles, should be relatively straightforward to address.

###ToDo
***
#General
Write tests
Plugin system to better modulize temporal widgets

#Time management
Add date/time picker
Improve timezone selector

#Satalite Map
Improve the accuracy of the solar terminator. At any zoom level, it should be a linear gradient 55 km wide.
Pansharpen night time raster and increase zoom level
Show eclipses

#Additional Temporal Widgets
Planetary positions
Moon phase
Solar weather (Note: use [this source of data](https://www.spaceweatherlive.com), and [these images for the sun]() if avalible at selected time)
[Time Magizine covers](), see [this tutorial](https://www.pyimagesearch.com/2015/10/12/scraping-images-with-python-and-scrapy/)
[significant events]() from Wikipedia

###Credits
***
The map is built on top of [Leaflet](https://leafletjs.com)
The daytime satellite images and all the satellite image hosting is provided by [MapBox](https://www.mapbox.com/)
The nighttime satellite images are from [NASA's Black Marble project](https://earthobservatory.nasa.gov/Features/NightLights/page3.php)
The SVGs in the time controls are from [Feather Icons](https://feathericons.com/)
The code to calculate the solar terminator is from [Leaflet.Terminator](https://github.com/joergdietrich/Leaflet.Terminator/)
The code for drawing the solar terminator is adapted from [Leaflet Boundary Canvas](https://github.com/aparshin/leaflet-boundary-canvas)
The code for calculating the position of the planets is from [a subset of Martin Vézina's jsOrrery](https://github.com/mgvez/planet-positions)
The SVG's for Venus, Earth, Mars, Jupiter, and Neptune were adapted from the [Tango Desktop project](http://tango.freedesktop.org/Tango_Desktop_Project), Saturn is from [Wikipedia](https://commons.wikimedia.org/wiki/File:Saturn-148300.svg), as is [Uranus](https://commons.wikimedia.org/wiki/File:Uranus2-by_Merlin2525.svg) 
The planet glyphs are from [Wikipedia](https://en.wikipedia.org/wiki/Astronomical_symbols#Symbols_for_the_planets)
The SVG's for the phases of the moon are from [Open Clip Art](https://openclipart.org)
[MomentJS](https://momentjs.com) is used for time calculations

#NPM and WebPack Plugins:
[autoprefixer](https://www.npmjs.com/package/autoprefixer),[babel-core](https://www.npmjs.com/package/babel-core),[babel-loader](https://www.npmjs.com/package/babel-loader),[babel-preset-env](https://www.npmjs.com/package/babel-preset-env),[file-loader](https://www.npmjs.com/package/file-loader),[css-loader](https://www.npmjs.com/package/css-loader),[mini-css-extract-plugin](https://www.npmjs.com/package/mini-css-extract-plugin),[node-sass](https://www.npmjs.com/package/node-sass),[postcss-loader](https://www.npmjs.com/package/postcss-loader),[sass-loader](https://www.npmjs.com/package/sass-loader),[style-loader](https://www.npmjs.com/package/style-loader),[webpack](https://www.npmjs.com/package/webpack),[webpack-cli](https://www.npmjs.com/package/webpack-cli)


Released under the MIT License