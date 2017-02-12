/**
 * Created by Dave on 2/11/2017.
 */
'use strict';

var DEGS = 180 / Math.PI;                  // convert radians to degrees
var RADS = Math.PI / 180;                  // convert degrees to radians
var EPS = 1.0e-12;                      // machine error constant

// orbital element structure
function elem() {
    this.a = parseFloat("0");                 // semi-major axis [AU]
    this.e = parseFloat("0");                 // eccentricity of orbit
    this.i = parseFloat("0");                 // inclination of orbit [deg]
    this.O = parseFloat("0");                 // longitude of the ascending node [deg]
    this.w = parseFloat("0");                 // longitude of perihelion [deg]
    this.L = parseFloat("0");                 // mean longitude [deg]
}

function XYZPoint(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;

    this.scale = function (scaleValue) {
        if (scaleValue == 1) {
            return;
        }

        this.x *= scaleValue;
        this.y *= scaleValue;
        this.z *= scaleValue;
    }
}

var planetNames = new Array("Mercury", "Venus", "Earth",
    "Mars", "Jupiter", "Saturn",
    "Uranus", "Neptune", "Pluto");

// compute ...
function getXyzForPlanet(planetName, date) {

    if (date == undefined) {
        // Default to current date
        date = new Date();
    }

    // compute day number for date/time
    var dayNumber = calculateDayNumber(date);

    var orbElems = getOrbitalElements(planetName, dayNumber);

    var ap = orbElems.a;
    var ep = orbElems.e;
    var ip = orbElems.i;
    var op = orbElems.O;
    var pp = orbElems.w;
    var lp = orbElems.L;

    // position of planet in its orbit
    var mp = mod2pi(lp - pp);
    var vp = calculateTrueAnomoly(mp, orbElems.e);
    var rp = ap * (1 - ep * ep) / (1 + ep * Math.cos(vp));

    // heliocentric rectangular coordinates of planet
    var xh = rp * (Math.cos(op) * Math.cos(vp + pp - op) - Math.sin(op) * Math.sin(vp + pp - op) * Math.cos(ip));
    var yh = rp * (Math.sin(op) * Math.cos(vp + pp - op) + Math.cos(op) * Math.sin(vp + pp - op) * Math.cos(ip));
    var zh = rp * (Math.sin(vp + pp - op) * Math.sin(ip));

    console.log(planetName + " xh: " + xh + " yx: " + yh);

    return new XYZPoint(xh, yh, zh);
}

// Compute the elements of the orbit for planet-i at day number-d
// result is returned in structure p
function getOrbitalElements(planetName, dayNumber) {
    var cy = dayNumber / 36525;                    // centuries since J2000

    var orbitalElements = new elem();

    switch (planetName) {
        case "Mercury":
            orbitalElements.a = 0.38709893 + 0.00000066 * cy;
            orbitalElements.e = 0.20563069 + 0.00002527 * cy;
            orbitalElements.i = ( 7.00487 - 23.51 * cy / 3600) * RADS;
            orbitalElements.O = (48.33167 - 446.30 * cy / 3600) * RADS;
            orbitalElements.w = (77.45645 + 573.57 * cy / 3600) * RADS;
            orbitalElements.L = mod2pi((252.25084 + 538101628.29 * cy / 3600) * RADS);
            break;
        case "Venus":
            orbitalElements.a = 0.72333199 + 0.00000092 * cy;
            orbitalElements.e = 0.00677323 - 0.00004938 * cy;
            orbitalElements.i = (  3.39471 - 2.86 * cy / 3600) * RADS;
            orbitalElements.O = ( 76.68069 - 996.89 * cy / 3600) * RADS;
            orbitalElements.w = (131.53298 - 108.80 * cy / 3600) * RADS;
            orbitalElements.L = mod2pi((181.97973 + 210664136.06 * cy / 3600) * RADS);
            break;
        case "Earth":
            orbitalElements.a = 1.00000011 - 0.00000005 * cy;
            orbitalElements.e = 0.01671022 - 0.00003804 * cy;
            orbitalElements.i = (  0.00005 - 46.94 * cy / 3600) * RADS;
            orbitalElements.O = (-11.26064 - 18228.25 * cy / 3600) * RADS;
            orbitalElements.w = (102.94719 + 1198.28 * cy / 3600) * RADS;
            orbitalElements.L = mod2pi((100.46435 + 129597740.63 * cy / 3600) * RADS);
            break;
        case "Mars":
            orbitalElements.a = 1.52366231 - 0.00007221 * cy;
            orbitalElements.e = 0.09341233 + 0.00011902 * cy;
            orbitalElements.i = (  1.85061 - 25.47 * cy / 3600) * RADS;
            orbitalElements.O = ( 49.57854 - 1020.19 * cy / 3600) * RADS;
            orbitalElements.w = (336.04084 + 1560.78 * cy / 3600) * RADS;
            orbitalElements.L = mod2pi((355.45332 + 68905103.78 * cy / 3600) * RADS);
            break;
        case "Jupiter":
            orbitalElements.a = 5.20336301 + 0.00060737 * cy;
            orbitalElements.e = 0.04839266 - 0.00012880 * cy;
            orbitalElements.i = (  1.30530 - 4.15 * cy / 3600) * RADS;
            orbitalElements.O = (100.55615 + 1217.17 * cy / 3600) * RADS;
            orbitalElements.w = ( 14.75385 + 839.93 * cy / 3600) * RADS;
            orbitalElements.L = mod2pi((34.40438 + 10925078.35 * cy / 3600) * RADS);
            break;
        case "Saturn":
            orbitalElements.a = 9.53707032 - 0.00301530 * cy;
            orbitalElements.e = 0.05415060 - 0.00036762 * cy;
            orbitalElements.i = (  2.48446 + 6.11 * cy / 3600) * RADS;
            orbitalElements.O = (113.71504 - 1591.05 * cy / 3600) * RADS;
            orbitalElements.w = ( 92.43194 - 1948.89 * cy / 3600) * RADS;
            orbitalElements.L = mod2pi((49.94432 + 4401052.95 * cy / 3600) * RADS);
            break;
        case "Uranus":
            orbitalElements.a = 19.19126393 + 0.00152025 * cy;
            orbitalElements.e = 0.04716771 - 0.00019150 * cy;
            orbitalElements.i = (  0.76986 - 2.09 * cy / 3600) * RADS;
            orbitalElements.O = ( 74.22988 - 1681.40 * cy / 3600) * RADS;
            orbitalElements.w = (170.96424 + 1312.56 * cy / 3600) * RADS;
            orbitalElements.L = mod2pi((313.23218 + 1542547.79 * cy / 3600) * RADS);
            break;
        case "Neptune":
            orbitalElements.a = 30.06896348 - 0.00125196 * cy;
            orbitalElements.e = 0.00858587 + 0.00002510 * cy;
            orbitalElements.i = (  1.76917 - 3.64 * cy / 3600) * RADS;
            orbitalElements.O = (131.72169 - 151.25 * cy / 3600) * RADS;
            orbitalElements.w = ( 44.97135 - 844.43 * cy / 3600) * RADS;
            orbitalElements.L = mod2pi((304.88003 + 786449.21 * cy / 3600) * RADS);
            break;
        case "Pluto":
            orbitalElements.a = 39.48168677 - 0.00076912 * cy;
            orbitalElements.e = 0.24880766 + 0.00006465 * cy;
            orbitalElements.i = ( 17.14175 + 11.07 * cy / 3600) * RADS;
            orbitalElements.O = (110.30347 - 37.33 * cy / 3600) * RADS;
            orbitalElements.w = (224.06676 - 132.25 * cy / 3600) * RADS;
            orbitalElements.L = mod2pi((238.92881 + 522747.90 * cy / 3600) * RADS);
            break;
        default:
            console.log("Invalid planet name " + planetName + " passed to getOrbitalElements()");
    }

    return orbitalElements;
}

// day number to/from J2000 (Jan 1.5, 2000)
function calculateDayNumber(date) {


    var year = date.getUTCFullYear();
    var month = date.getUTCMonth() + 1;
    var day = date.getUTCDate();
    var hour = date.getUTCHours();
    var mins = date.getUTCMinutes();

    var h = hour + mins / 60;

    var dayNumber = 367 * year
        - Math.floor(7 * (year + Math.floor((month + 9) / 12)) / 4)
        + Math.floor(275 * month / 9) + day - 730531.5 + h / 24;

    return dayNumber;
}

// compute the true anomaly from mean anomaly using iteration
//  M - mean anomaly in radians
//  e - orbit eccentricity
function calculateTrueAnomoly(M, e) {
    var V, E1;

    // initial approximation of eccentric anomaly
    var E = M + e * Math.sin(M) * (1.0 + e * Math.cos(M));

    do                                   // iterate to improve accuracy
    {
        E1 = E;
        E = E1 - (E1 - e * Math.sin(E1) - M) / (1 - e * Math.cos(E1));
    }
    while (Math.abs(E - E1) > EPS);

    // convert eccentric anomaly to true anomaly
    V = 2 * Math.atan(Math.sqrt((1 + e) / (1 - e)) * Math.tan(0.5 * E));

    if (V < 0) V = V + (2 * Math.PI);      // modulo 2pi

    return V;
}

// return an angle in the range 0 to 2pi radians
function mod2pi(x) {
    var b = x / (2 * Math.PI);
    var a = (2 * Math.PI) * (b - abs_floor(b));
    if (a < 0) a = (2 * Math.PI) + a;
    return a;
}

// return the integer part of a number
function abs_floor(x) {
    var r;
    if (x >= 0.0) r = Math.floor(x);
    else          r = Math.ceil(x);
    return r;
}

getXyzForPlanet("Earth", new Date(2018, 7, 1));
getXyzForPlanet("Mars", new Date(2018, 7, 1));