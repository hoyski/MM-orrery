/**
 * Orrery (planet model) module for MagicMirror.
 */
Module.register("MM-orrery", {
    // Default module config
    defaults: {
        width: 900,
        height: 800
    },

    planets : [
            {name: "Mercury", scale: 1.0},
            {name: "Venus", scale: 1.0},
            {name: "Earth", scale: 1.0},
            {name: "Mars", scale: 1.0},
            {name: "Jupiter", scale: 0.4},
            {name: "Saturn", scale: 0.25},
            {name: "Uranus", scale: 0.1},
            {name: "Neptune", scale: 0.1}
    ],

    getScripts : function () {
        return ['planetCalcs.js']
    },

    getDom : function () {
        var wrapper = document.createElement("div");

        var canvas = document.createElement("canvas");
        wrapper.appendChild(canvas);

        canvas.width = this.config.width;
        canvas.height = this.config.height;

        var ctx = canvas.getContext("2d");

        ctx.font ="15px Arial";

        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw the sun
        ctx.beginPath();
        ctx.fillStyle = 'yellow';
        ctx.arc(canvas.width / 2, canvas.height / 2, 8, 0, 2 * Math.PI, false);
        ctx.fill();

        //var date = new Date(year, month - 1, 1);
        var date = new Date();

        console.log("Drawing planet positions for " + date);

        // Calculate the XYZ positions for each planet
        for (var i = 0; i < this.planets.length; ++i) {
            var xyz = getXyzForPlanet(this.planets[i].name, date);

            xyz.scale(this.planets[i].scale);

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
        var maxXY =  Math.max(maxX, maxY);
        var minWH = Math.min(canvas.width, canvas.height) / 2;
        var solarScale = minWH / maxXY;

        console.log("Calculated solarScale of " + solarScale);

        // Draw the planets
        for (var i = 0; i < this.planets.length; ++i)
        {
            if (this.planets[i].name == "Earth") {
                ctx.fillStyle = 'blue';
            }
            else {
                ctx.fillStyle = 'red';
            }
            ctx.fillStyle = "white";

            // Convert heliocentric AU co-ordinates to canvas pixel co-ordinates
            var centerX = this.planets[i].xyz.x * solarScale + canvas.width / 2;
            var centerY = canvas.height / 2 - this.planets[i].xyz.y * solarScale;

            //console.log("[" + xyz.x + ":" + xyz.y + "] - Drawing circle at " + centerX + ":" + centerY);

            ctx.beginPath();
            ctx.arc(centerX, centerY, 5, 0, 2 * Math.PI, false);
            ctx.fillText(this.planets[i].name, centerX + 8, centerY - 5);
            ctx.fill();
        }

        return wrapper;
    },

    start: function () {
        Log.log(this.name + " is started");
    }
});
