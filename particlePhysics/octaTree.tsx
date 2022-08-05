import { Iparallelepiped, Ishape, parallelepiped } from "./shapes";
import * as THREE from "three";
import { Tparticle, Ttree } from "./types";

const octaTree = function (boundary: Iparallelepiped, capacity: number) {
  const self: { [ket: string]: any } = {
    boundary,
    capacity,
    points: [],
    divided: false,
    subTrees: [],
  };

  self.subdivide = function () {
    const subBoundaries = [];
    let subW = boundary.hw;
    let subH = boundary.hh;
    let subD = boundary.hd;
    for (let i = 0; i < 2; i++) {
      for (let j = 0; i < 2; j++) {
        for (let k = 0; k < 2; k++) {
          let id = i * 4 + j * 2 + k;
          let subcx = boundary.x + (boundary.w / 4) * (2 * i - 1);
          let subcy = boundary.y + (boundary.h / 4) * (2 * j - 1);
          let subcz = boundary.z + (boundary.z / 4) * (2 * k - 1);
          let subcenter = new THREE.Vector3(subcx, subcy, subcz);
          subBoundaries[id] = parallelepiped(subcenter, subW, subH, subD);
          self.subTrees[id] = octaTree(subBoundaries[id], self.capacity);
        }
      }
    }
    self.divided = true;
  };

  self.insert = function (point: Tparticle) {
    if (!self.boundary.contains(point)) {
      return false;
    }

    if (self.points.length < self.capacity) {
      self.points.push(point);
      return true;
    }

    if (!self.divided) {
      self.subdivide();
    }

    if (
      self.subTrees[0].insert(point) ||
      self.subTrees[1].insert(point) ||
      self.subTrees[2].insert(point) ||
      self.subTrees[3].insert(point) ||
      self.subTrees[4].insert(point) ||
      self.subTrees[5].insert(point) ||
      self.subTrees[6].insert(point) ||
      self.subTrees[7].insert(point)
    ) {
      return true;
    }

    console.log("octaTree failed to insert particle somehow");
    return false;
  };

  self.query = function (range: Ishape, found: Tparticle[]) {
    if (!found) {
      found = [];
    }

    if (!range.intersects(self.boundary)) {
      return found;
    }

    for (let p of self.points) {
      if (range.contains(p)) {
        found.push(p);
      }
    }

    if (self.divided) {
      self.subTrees.forEach((sub3: Ttree) => sub3.query(range, found));
    }

    return found;
  };

  self.remove = function (point: Tparticle) {
    let indexToRemove = self.points.indexOf(point);
    if (indexToRemove > -1) {
      self.points.splice(indexToRemove, 1);
    } else {
      if (self.divided) {
        self.subTrees.forEach((sub3: Ttree) => sub3.remove(point));
      }
    }
  };

  self.count = function () {
    let counter = self.points.length;
    if (self.divided) {
      self.subTrees.forEach((sub3: Ttree) => {
        counter += sub3.count();
      });
    }
    return counter;
  };

  return self as Ttree;
};

export default octaTree;
