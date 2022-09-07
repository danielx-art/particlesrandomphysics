import * as THREE from "three";
//import { Vector3 } from "three";

export interface Ishape {
  center: THREE.Vector3;
  x: number;
  y: number;
  z: number;
  contains: (point: any) => boolean;
  intersects: (other: Iparallelepiped) => boolean;
}

export interface Iparallelepiped extends Ishape {
  width: number;
  height: number;
  depth: number;
  w: number;
  h: number;
  d: number;
  hw: number;
  hh: number;
  hd: number;
  intersectsSphere: (sphere: Isphere) => boolean;
}

export interface Isphere extends Ishape {
  radius: number;
}

export function parallelepiped(
  center: THREE.Vector3,
  width: number,
  height: number,
  depth: number
): Iparallelepiped {
  let x = center.x;
  let y = center.y;
  let z = center.z;
  let w = width;
  let h = height;
  let d = depth;
  let hw = w / 2;
  let hh = h / 2;
  let hd = d / 2;

  let contains = (point: any) => {
    return (
      point.x >= x - hw &&
      point.x <= x + hw &&
      point.y >= y - hh &&
      point.y <= y + hh &&
      point.z >= z - hd &&
      point.z <= z + hd
    );
  };

  let intersects = (other: Iparallelepiped) => {
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

  let intersectsSphere = (sphere: Isphere) => {
    let minX = x - hw;
    let maxX = x + hw;
    let minY = y - hh;
    let maxY = y + hh;
    let minZ = z - hd;
    let maxZ = z + hd;

    // get box closest point to sphere center by clamping
    let cx = Math.max(minX, Math.min(sphere.x, maxX));
    let cy = Math.max(minY, Math.min(sphere.y, maxY));
    let cz = Math.max(minZ, Math.min(sphere.z, maxZ));

    // this is the same as isPointInsideSphere
    let distance = Math.sqrt(
      (cx - sphere.x) * (cx - sphere.x) +
        (cy - sphere.y) * (cy - sphere.y) +
        (cz - sphere.z) * (cz - sphere.z)
    );

    return distance < sphere.radius;
  };

  let self = {
    center,
    width,
    height,
    depth,
    x,
    y,
    z,
    w,
    h,
    d,
    hw,
    hh,
    hd,
    contains,
    intersects,
    intersectsSphere,
  };

  return self;
}

export function sphere(center: THREE.Vector3, radius: number) {
  let intersects = (aparallelepiped: Iparallelepiped) => {
    return aparallelepiped.intersectsSphere(sphere(center, radius));
  };

  let contains = (point: any) => {
    let pointV3 = new THREE.Vector3(point.x, point.y, point.z);
    let dr2 = pointV3.distanceToSquared(center);
    return dr2 <= radius;
  };

  return {
    center,
    radius,
    x: center.x,
    y: center.y,
    z: center.z,
    intersects,
    contains,
  };
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
