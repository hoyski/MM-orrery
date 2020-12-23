# MM-orrery
A module for MagicMirror<sup>2</sup> that displays all of the planets and their current relation to the Sun

## Dependencies
  * A [MagicMirror<sup>2</sup>](https://magicmirror.builders/) installation

## Installation
  1. Clone this repo into your `modules` directory.
  2. Create an entry in your `config.js` file to tell this module where and how to display on screen.

 **Example:**
```
{
    module: 'MM-orrery',
    position: 'middle_center',
    config: {
        width: 800,
        height: 600,
        venusColor: 'yellow',
        earthColor: 'blue',
        marsColor: 'red',
        sunRadius: 12,
        uranusScale: 0.4,
        neptuneScale: 0.4
    }
}, // Note: Remove the comma if MM-orrery is the last module in your list
```
## Config
| **Option**                                           | **Default**     | **Description**                                                                                                                                                                                                                                                                                                                                        |
| ---------------------------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `width`                                              | 900             | Width of the module in pixels. *Note:* Set the width greater than the height if Neptune's label is truncated                                                                                                                                                                                                                                           |
| `height`                                             | 800             | Height of the module in pixels.                                                                                                                                                                                                                                                                                                                        |
| `updateInterval`                                     | 24              | Time between updates in hours                                                                                                                                                                                                                                                                                                                          |
| `showLabels`                                         | true            | Whether or not to display each planet's name                                                                                                                                                                                                                                                                                                           |
| `labelColor`                                         | gray            | Color for the labels                                                                                                                                                                                                                                                                                                                                   |
| `labelFont`                                          | 10px Helvetica  | Font for the labels                                                                                                                                                                                                                                                                                                                                    |
| `showOrbits`                                         | true            | Whether or not to display the planets' orbits                                                                                                                                                                                                                                                                                                          |
| `orbitColor`                                         | #282828         | Color for the orbits. Default is a very dark gray                                                                                                                                                                                                                                                                                                      |
| `mercuryScale` thru `neptuneScale`                   | See description | The solar system is big, like *really* big. In order for the outer planets to fit on the screen their distances from the Sun have to be reduced. The eight *planet*Scale settings define multipliers applied to the planets' positions. The defaults are 1.0 for Mercury thru Mars, 0.4 for Jupiter, 0.25 for Saturn, and 0.15 for Uranus and Neptune. |
| `sunRadius` and `mercuryRadius` thru `neptuneRadius` | See description | Render radius for the Sun and each planet in pixels. The defaults are 8 for the Sun, 3 for Mercury, 5 for Venus and Earth, 4 for Mars, 8 for Jupiter, 7 for Saturn, and 6 for Uranus and Neptune                                                                                                                                                       |
| `sunColor` and `mercuryColor` thru `neptuneColor`    | See description | Render color for the Sun and each planet. Defaults are 'yellow' for the Sun and 'white' for all of the planets                                                                                                                                                                                                                                         |


