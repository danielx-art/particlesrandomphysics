import { Vector3 } from "three";
import { parallelepiped } from "./shapes";
import vec from "./vetores"
import {pickRandomItemsFromArray} from './helpers'
import * as POSGEN from './generators/positionGenerators'

function pickRandomGenerator<Type>(importedGeneratorsObj: {[char: string]: Type}){
  let generators = Object.keys(importedGeneratorsObj);
  let randomGenerator = pickRandomItemsFromArray(generators, 1) as string;
  return importedGeneratorsObj[randomGenerator];
}

export type parametersType = {
  num: number,
  boundary: object,
  posGenerator: Vector3[],
  dirGenerator: Vector3[],
  inertialMass: number[],
  momentInertia: number[],
  movement: string,
  initialVelocity: Vector3[],
  initialAngularVelocity: Vector3[],
  maxForce: number[],
  maxTorque: number[],
  maxSpeed: number[],
  maxAngVel: number[],
  translationDamping: number[],
  rotationDamping: number[],
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

  posGenerator: ,

  dirGenerator: ,

  inertialMass: ,
  momentInertia: ,

  movement: "dynamic",

  initialVelocity: ,
  initialAngularVelocity:,
  maxForce: ,
  maxTorque: ,
  maxSpeed: ,
  maxAngVel: ,
  translationDamping: ,
  rotationDamping: ,

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