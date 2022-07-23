import * as THREE from "three";
import { Vector3 } from "three";
import { parallelepiped } from "./shapes";
import vec from "./vetores"

type vectorGeneratorType = (( a: number | Array<number> ) => Vector3) | number | Array<number>;

type scalarGeneratorType = (( a: number | Array<number> ) => number) | number;

export type parametersType = {
  num: number,
  boundary: object,
  posGenerator: vectorGeneratorType ,
  dirGenerator: vectorGeneratorType
  inertialMass: scalarGeneratorType,
  momentInertia: scalarGeneratorType,
  movement: string,
  initialVelocity: vectorGeneratorType,
  initialAngularVelocity: vectorGeneratorType,
  maxForce: scalarGeneratorType,
  maxTorque: scalarGeneratorType,
  maxSpeed: scalarGeneratorType,
  maxAngVel: scalarGeneratorType,
  translationDamping: scalarGeneratorType,
  rotationDamping: scalarGeneratorType,
  wrap: string,
  queryRadius: number,
  safeRadius: number,
  merge: boolean,
  behaviours:  (a: number) => Array<any>,
  display: null,
}; 

export const defaultSystemParameters: parametersType = {
  num: 3,

  boundary: parallelepiped(vec(), 100,100,100),

  posGenerator: (i) => {
    return vec();
  },

  dirGenerator: (i) => {
    return vec();
  },

  inertialMass: (i) => {
    return 1;
  },
  momentInertia: (i) => {
    return 1000;
  },

  movement: "dynamic",

  initialVelocity: (i) => {
    return vec();
  },
  initialAngularVelocity: (i) => {
    return vec();
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