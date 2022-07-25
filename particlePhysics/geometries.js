/*
Geometries, what should they do?

1.From geometry coords to canvas coords function

2.From canvas coords to geometry coords function

3.Distance function

As an example, the bellow euclidean geometry would be one that does literally nothing
*/

export default function euclidean() {
  toCanvas = function (vec) {
    return vec.copy(vec);
  };

  fromCanvas = function (vec) {
    return vec.copy(vec);
  };

  r = function (pointA, pointB) {
    return vec().copy(this.fromCanvas(pointB)).sub(this.fromCanvas(pointA)); //vector pointing from A to B
  };

  distance = function (pointA, pointB) {
    return r(pointA, pointB).mag();
  };
}

//TORUS GEOMETRY WILL WRAP THE PARTICLES AROUND
export function torus() {}

//SPHERICAL GEOMERY WILL WRAP PARTICLES BUT IN A DIFFERENT WAY
export function sphericalGeometry() {}
