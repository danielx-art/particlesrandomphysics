import * as THREE from "three";
import { Vector3 } from 'three';
import { parallelepiped } from "./shapes";

export type parametersT = {
  num: Number,
  boundary: {},
  posGenerator: (a: Number) =>  Vector3 ,
  dirGenerator: (a: Number) => Vector3,
  inertialMass: Number |((a: Number) => Number),
  momentInertia: Number |((a: Number) => Number),
  movement: String,
  initialVelocity: (a: Number) =>  Vector3,
  initialAngularVelocity: (a: Number) =>  Vector3,
  maxForce: Number |((a: Number) => Number),
  maxTorque: Number |((a: Number) => Number),
  maxSpeed: Number |((a: Number) => Number),
  maxAngVel: Number |((a: Number) => Number),
  translationDamping: Number |((a: Number) => Number),
  rotationDamping: Number |((a: Number) => Number),
  wrap: String,
  queryRadius: Number,
  safeRadius: Number,
  merge: boolean,
  behaviours:  (a: Number) => Array<any>,
  display: null,
}; 

export const defaultSystemParameters = {
  num: 3,

  boundary: parallelepiped()), //should take a look at the size of the viweport in the coords of three js canvas

  posGenerator: (i) => {
    return new THREE.Vector3(
      Math.random() * (this.boundary.width - 200) + 100,
      Math.random() * (this.height - 200) + 100,
      Math.random() * (this.depth - 200) + 100
    );
  },

  dirGenerator: (i) => {
    return new THREE.Vector3.randomUnitVector();
  },

  inertialMass: (i) => {
    return 1;
  },
  momentInertia: (i) => {
    return 1000;
  },

  movement: "dynamic",

  initialVelocity: (i) => {
    return new THREE.Vector3.randomUnitVector();
  },
  initialAngularVelocity: (i) => {
    return new THREE.Vector3.randomUnitVector();
  },
  maxForce: (i) => {
    return 10;
  },
  maxTorque: (i) => {
    return 0.5;
  },
  maxSpeed: (i) => {
    return 0.1;
  },
  maxAngVel: (i) => {
    return 0.1;
  },
  translationDamping: (i) => {
    return 1;
  },
  rotationDamping: (i) => {
    return 1;
  },

  wrap: "bounce",

  queryRadius: 500,

  safeRadius: 5,

  merge: false,

  behaviours: (i) => {
    return [
      {
        type: "gravity",
        G: 10,
      },
    ];
  },

  display: null,
};
