import * as THREE from "three";

export function parallelepiped(center, width, height, depth) {
  const self = {
    center,
    width,
    height,
    depth,
    x: center.x,
    y: center.y,
    z: center.z,
    w: self.width,
    h: self.height,
    d: self.depth,
    hw: w / 2,
    hh: h / 2,
    hd: d / 2,
  };

  self.contains = (point) => {
    return (
      point.x >= x - hw &&
      point.x <= x + hw &&
      point.y >= y - hh &&
      point.y <= y + hh &&
      point.z >= z - hd &&
      point.z <= z + hd
    );
  };

  self.intersects = (other) => {
    let minX = x - hw;
    let maxX = x + hw;
    let minY = y - hh;
    let maxY = y + hh;
    let minZ = z - hd;
    let maxZ = z + hd;
    let ominX = other.x - other.hw;
    let omaxX = other.x + other.hw;
    let ominY = other.y - other.hh;
    let omaxY = other.y + other.hh;
    let ominZ = other.z - other.hd;
    let omaxZ = other.z + other.hd;

    return (
      minY <= omaxY &&
      maxY >= ominY &&
      minX <= omaxX &&
      maxX >= ominX &&
      minZ <= omaxZ &&
      maxZ >= ominZ
    );
  };

  self.intersectsSphere = (sphere) => {
    let minX = x - hw;
    let maxX = x + hw;
    let minY = y - hh;
    let maxY = y + hh;
    let minZ = z - hd;
    let maxZ = z + hd;

    // get box closest point to sphere center by clamping
    let x = Math.max(minX, Math.min(sphere.x, maxX));
    let y = Math.max(minY, Math.min(sphere.y, maxY));
    let z = Math.max(minZ, Math.min(sphere.z, maxZ));

    // this is the same as isPointInsideSphere
    let distance = Math.sqrt(
      (x - sphere.x) * (x - sphere.x) +
        (y - sphere.y) * (y - sphere.y) +
        (z - sphere.z) * (z - sphere.z)
    );

    return distance < sphere.radius;
  };

  return self;
}

export function sphere(center, radius) {
  const self = {
    center,
    radius,
    x: center.x,
    y: center.y,
    z: center.z,
  };

  self.intersects = (aparallelepiped) => {
    return aparallelepiped.intersectsSphere(self);
  };

  self.contains = (point) => {
    let pointV3 = new THREE.Vector3(point.x, point.y, point.z);
    let dr2 = pointV3.distanceToSquared(center);
    return dr2 <= self.radius;
  };

  return self;
}

// export function rectangle (x,y,width,height,) {
//     const self = {
//         x,
//         y,
//         width,
//         height,
//     }

//     self.contains = function(point){
//         return (
//         point.x >= self.x - self.width/2  &&
//         point.x <= self.x + self.width/2  &&
//         point.y >= self.y - self.height/2 &&
//         point.y <= self.y + self.height/2
//         );
//     }

//     self.intersects = function(range) {
//         return !(
//         range.x - range.width/2 > this.x + this.width/2   ||
//         range.x + range.width/2 < this.x - this.width/2   ||
//         range.y - range.heigth/2 > this.y + this.heigth/2 ||
//         range.y + range.heigth/2 < this.y - this.heigth/2
//         );
//     }

//     return self;
// };

// export function circle (x, y, r) {

//     const self = {
//         x,
//         y,
//         r,
//         get width(){
//             return 2*r;
//         },
//         get height(){
//             return 2*r;
//         }
//     }

//     self.contains = function(point) {
//         // check if the point is in the circle by checking if the euclidean distance of
//         // the point and the center of the circle if smaller or equal to the radius of
//         // the circle
//         let d = Math.pow(point.x - self.x, 2) + Math.pow(point.y - self.y, 2);
//         return d <= self.r*self.r;
//     }

//     self.intersects = function(range) {
//         var xDist = Math.abs(range.x - self.x);
//         var yDist = Math.abs(range.y - self.y);

//         var r = self.r;

//         var w = range.width/2;
//         var h = range.height/2;

//         var edges = Math.pow(xDist - w, 2) + Math.pow(yDist - h, 2);

//         // no intersection
//         if (xDist > r + w || yDist > r + h) return false;

//         // intersection within the circle
//         if (xDist <= w || yDist <= h) return true;

//         // intersection on the edge of the circle
//         return edges <= self.r*self.r;
//     }

//     return self;
// }
