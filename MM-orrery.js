/**
 * Orrery (planet model) module for MagicMirror.
 */
Module.register("MM-orrery", {
    // Default module config
    defaults: {
        text: "Hi, Everybody!",
        width: 300,
        height: 300
    },

    getScripts : function () {
        return ['planetCalcs.js']
    },

    getDom: function () {
        var wrapper = document.createElement("div");

        var canvas = document.createElement("canvas");
        wrapper.appendChild(canvas);

        var ctx = canvas.getContext("2d");

        ctx.font ="15px Arial";

        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw the sun
        ctx.beginPath();
        ctx.fillStyle = 'yellow';
        ctx.arc(canvas.width / 2, canvas.height / 2, 8, 0, 2 * Math.PI, false);
        ctx.fill();

        var date = new Date(year, month - 1, 1);

        // Update the date displayed on the page
        var dateSpan = document.getElementById("dateToDraw").innerText = year + "-" + month + "-1";

        console.log("Date: " + date);

        // Calculate the XYZ positions for each planet
        for (var i = 0; i < planets.length; ++i) {
            var xyz = getXyzForPlanet(planets[i].name, date);

            xyz.scale(planets[i].scale);

            planets[i].xyz = xyz;
        }

        // Calculate the scaling factor to make all of the planets fit on the canvas
        var maxX = 0;
        var maxY = 0;

        for (var i = 0; i < planets.length; ++i) {
            if (Math.abs(planets[i].xyz.x) > maxX) {
                maxX = Math.abs(planets[i].xyz.x);
            }
            if (Math.abs(planets[i].xyz.y) > maxY) {
                maxY = Math.abs(planets[i].xyz.y);
            }
        }
        var maxXY =  Math.max(maxX, maxY);
        var minWH = Math.min(canvas.width, canvas.height) / 2;
        var solarScale = minWH / maxXY;

        console.log("Calculated solarScale of " + solarScale);

        // Draw the planets
        for (var i = 0; i < planets.length; ++i)
        {
            if (planets[i].name == "Earth") {
                ctx.fillStyle = 'blue';
            }
            else {
                ctx.fillStyle = 'red';
            }
            ctx.fillStyle = "white";

            var centerX = planets[i].xyz.x * solarScale + canvas.width / 2;
            var centerY = canvas.height / 2 - planets[i].xyz.y * solarScale;

            //console.log("[" + xyz.x + ":" + xyz.y + "] - Drawing circle at " + centerX + ":" + centerY);

            ctx.beginPath();
            ctx.arc(centerX, centerY, 5, 0, 2 * Math.PI, false);
            ctx.fillText(planets[i].name, centerX + 8, centerY - 5);
            ctx.fill();
        }

        return wrapper;
    },

    start: function () {
        Log.log(this.name + " is started");
    }
});
