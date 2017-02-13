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
        labelFont: '12px Arial',

        // Scales
        jupiterScale: 0.4,
        saturnScale: 0.25,
        uranusScale: 0.1,
        neptuneScale: 0.1,

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
        sunColor: 'yellow'
        /* All others default to white */
    },

    planets: [
        {
            name: "Mercury",
            xyz: undefined
        },
        {
            name: "Venus",
            xyz: undefined
        },
        {
            name: "Earth",
            xyz: undefined
        },
        {
            name: "Mars",
            xyz: undefined
        },
        {
            name: "Jupiter",
            xyz: undefined
        },
        {
            name: "Saturn",
            xyz: undefined
        },
        {
            name: "Uranus",
            xyz: undefined
        },
        {
            name: "Neptune",
            xyz: undefined
        }
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
        // Create the div for the module and the canvas for the drawing
        var wrapper = document.createElement("div");

        var canvas = document.createElement("canvas");
        wrapper.appendChild(canvas);

        canvas.width = this.config.width;
        canvas.height = this.config.height;

        var ctx = canvas.getContext("2d");

        ctx.font = this.config.labelFont;

        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        //var date = new Date(year, month - 1, 1);
        var date = new Date();

        Log.log("Drawing planet positions for " + date);

        // Calculate the XYZ positions for each planet
        for (var i = 0; i < this.planets.length; ++i) {
            var xyz = getXyzForPlanet(this.planets[i].name, date);

            //xyz.scale(this.planets[i].scale);
            xyz.scale(this.getPlanetScale(this.planets[i].name, 1.0));

            this.planets[i].xyz = xyz;
        }

        // Calculate the scaling factor to make all of the planets fit on the canvas
        var maxX = 0;
        var maxY = 0;

        for (var i = 0; i < this.planets.length; ++i) {
            if (Math.abs(this.planets[i].xyz.x) > maxX) {
                maxX = Math.abs(this.planets[i].xyz.x);
            }
            if (Math.abs(this.planets[i].xyz.y) > maxY) {
                maxY = Math.abs(this.planets[i].xyz.y);
            }
        }
        var maxXY = Math.max(maxX, maxY);
        var minWH = Math.min(canvas.width, canvas.height) / 2;
        var solarScale = minWH / maxXY;


        // Draw the sun
        ctx.beginPath();
        ctx.fillStyle = this.getPlanetColor('sun');
        var sunRadius = this.getPlanetRadius('sun');
        ctx.arc(canvas.width / 2, canvas.height / 2, sunRadius, 0, 2 * Math.PI, false);
        ctx.fill();

        // Draw the planets
        for (var i = 0; i < this.planets.length; ++i) {

            // Convert heliocentric AU co-ordinates to canvas pixel co-ordinates
            var centerX = this.planets[i].xyz.x * solarScale + canvas.width / 2;
            var centerY = canvas.height / 2 - this.planets[i].xyz.y * solarScale;

            // Draw the planet
            var radius = this.getPlanetRadius(this.planets[i].name, 5);

            ctx.fillStyle = this.getPlanetColor(this.planets[i].name, 'white');
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
            ctx.fill();

            // Draw the label
            if (this.config.showLabels == true) {
                ctx.beginPath();
                ctx.fillStyle = this.config.labelColor;
                ctx.fillText(this.planets[i].name, centerX + radius + 2, centerY - radius);
                ctx.fill();
            }
        }

        return wrapper;
    },

    start: function () {
        var updateInterval = this.config.updateInterval * 60 * 60 * 1000;

        var self = this;

        setInterval(function() {
            self.updateDom();
        }, updateInterval);

        Log.log(this.name + " is started. Updates scheduled for every " + updateInterval + " ms");
    }
});