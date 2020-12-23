/**
 * Orrery (planet model) module for MagicMirror.
 */
Module.register("MM-orrery", {
	// Default module config
	defaults: {
		width: 900,
		height: 800,
		updateInterval: 24, // Default to daily updates
		showLabels: true,
		labelColor: 'gray',
		labelFont: '10px Helvetica',
		showOrbits: true,
		orbitColor: '#282828',

		// Scales
		jupiterScale: 0.4,
		saturnScale: 0.25,
		uranusScale: 0.15,
		neptuneScale: 0.15,

		// Drawing sizes
		sunRadius: 8,
		mercuryRadius: 3,
		venusRadius: 5,
		earthRadius: 5,
		marsRadius: 4,
		jupiterRadius: 8,
		saturnRadius: 7,
		uranusRadius: 6,
		neptuneRadius: 6,

		// Sun and planet colors
		sunColor: 'yellow',
		/* All others default to white */

		debug: false
	},

	planets: [
		makePlanet("Mercury", 1, 88),
		makePlanet("Venus", 2, 225 / 2 + 1),
		makePlanet("Earth", 5, 365 / 5 + 1),
		makePlanet("Mars", 10, 687 / 10 + 1),
		makePlanet("Jupiter", 50, 4332 / 50 + 1),
		makePlanet("Saturn", 50, 10761 / 50 + 1),
		makePlanet("Uranus", 50, 30685 / 50 + 1),
		makePlanet("Neptune", 50, 60191 / 50 + 1)
	],

	// Returns configuration value for the given planet and config type or 'dfltVal' if none has been defined
	getPlanetConfig: function (planetName, configType, dfltVal) {
		var value = this.config[planetName.toLowerCase() + configType];
		if (value == undefined) {
			return dfltVal;
		}
		return value;
	},

	// Returns the scaling factor for the given planet or 'dfltVal' if none has been defined
	getPlanetScale: function (planetName, dfltVal) {
		return this.getPlanetConfig(planetName, 'Scale', dfltVal);
	},

	// Returns the radius in pixels to rander the given planet or 'dfltVal' if none has been defined
	getPlanetRadius: function (planetName, dfltVal) {
		return this.getPlanetConfig(planetName, 'Radius', dfltVal);
	},

	// Returns the color to render the given planet or 'dfltVal' if none has been defined
	getPlanetColor: function (planetName, dfltVal) {
		return this.getPlanetConfig(planetName, 'Color', dfltVal);
	},

	getScripts: function () {
		return ['planetCalcs.js']
	},

	getDom: function () {
		var date = new Date();

		Log.log("Drawing planet positions for " + date);

		// Create the div for the module and the canvas for the drawing
		var wrapper = document.createElement("div");

		var canvas = document.createElement("canvas");

		// Add something to make the HTML different from the previous rendering 
		// so that MagicMirror will redraw the canvas
		canvas.setAttribute("id", "MM_orrery_" + date.getTime());
		wrapper.appendChild(canvas);

		canvas.width = this.config.width;
		canvas.height = this.config.height;
		var halfCWidth = canvas.width / 2;
		var halfCHeight = canvas.height / 2;

		var ctx = canvas.getContext("2d");
		canvas.style.background = document.body.style.background;

		ctx.font = this.config.labelFont;

		// Calculate the XYZ positions for each planet and record the maximum values found
		var maxX = 0;
		var maxY = 0;
		for (let planet of this.planets) {
			var xyz = getXyzForPlanet(planet.name, date);

			xyz.scale(this.getPlanetScale(planet.name, 1.0));

			planet.xyz = xyz;

			if (Math.abs(planet.xyz.x) > maxX) {
				maxX = Math.abs(planet.xyz.x);
			}
			if (Math.abs(planet.xyz.y) > maxY) {
				maxY = Math.abs(planet.xyz.y);
			}
		}

		if (this.config.showOrbits) {
			// Calculate all of the positions of Neptune's orbit and update maxX and maxY accordingly
			let neptune = this.planets[this.planets.length - 1];
			for (let i = 0; i < neptune.orbitNumSteps; ++i, date.setDate(date.getDate() + neptune.orbitStepDays)) {
				let xyz = getXyzForPlanet(neptune.name, date);
				xyz.scale(this.getPlanetScale(neptune.name, 1.0));
				if (Math.abs(xyz.x) > maxX) {
					maxX = Math.abs(xyz.x);
				}
				if (Math.abs(xyz.y) > maxY) {
					maxY = Math.abs(xyz.y);
				}
			}
		}

		// Calculate the scaling factor from AUs to canvas
		var maxXY = Math.max(maxX, maxY);
		var minWH = Math.min(canvas.width, canvas.height) / 2;
		var solarScale = minWH / maxXY;

		// Draw the orbits the cheap way by calculating the planets' positions
		// through one orbit into the future drawing a line along the way
		if (this.config.showOrbits) {
			for (let planet of this.planets) {
				let date = new Date();

				ctx.strokeStyle = this.config.orbitColor;
				ctx.beginPath();
				for (let i = 0; i < planet.orbitNumSteps; ++i, date.setDate(date.getDate() + planet.orbitStepDays)) {
					var xyz = getXyzForPlanet(planet.name, date);
					xyz.scale(this.getPlanetScale(planet.name, 1.0));

					var centerX = xyz.x * solarScale + canvas.width / 2;
					var centerY = halfCHeight - xyz.y * solarScale;
					if (i == 0) {
						ctx.moveTo(centerX, centerY);
					} else {
						ctx.lineTo(centerX, centerY);
					}
				}
				ctx.stroke();
			}
		}

		// Draw the sun
		ctx.beginPath();
		ctx.fillStyle = this.getPlanetColor('sun');
		var sunRadius = this.getPlanetRadius('sun');
		ctx.arc(halfCWidth, halfCHeight, sunRadius, 0, 2 * Math.PI, false);
		ctx.fill();

		// Draw the planets
		for (let planet of this.planets) {

			// Convert heliocentric AU co-ordinates to canvas pixel co-ordinates
			var centerX = planet.xyz.x * solarScale + halfCWidth;
			var centerY = halfCHeight - planet.xyz.y * solarScale;

			// Draw the planet
			var radius = this.getPlanetRadius(planet.name, 5);

			ctx.fillStyle = this.getPlanetColor(planet.name, 'white');
			ctx.beginPath();
			ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
			ctx.fill();

			// Draw the label
			if (this.config.showLabels == true) {
				ctx.beginPath();
				ctx.fillStyle = this.config.labelColor;
				ctx.fillText(planet.name, centerX + radius + 2, centerY - radius);
				ctx.fill();
			}
		}

		if (this.config.debug) {
			ctx.beginPath();
			ctx.fillStyle = 'white';
			ctx.fillText("Redrew planets at " + date, 10, canvas.height);
			ctx.fill();
		}

		return wrapper;
	},

	start: function () {
		var updateInterval = this.config.updateInterval * 60 * 60 * 1000;

		var self = this;

		setInterval(function () {
			self.updateDom();
		}, updateInterval);

		Log.log(`${this.name} is started. Updates scheduled for every ${updateInterval} ms`);
	}
});


// Returns an object with the name of the planet and the stepping values
// for drawing the orbit
function makePlanet(name, orbitStepDays, orbitNumSteps) {
	return {
		name,
		orbitStepDays,
		orbitNumSteps
	};
}