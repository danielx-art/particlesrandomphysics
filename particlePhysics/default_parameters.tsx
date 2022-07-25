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
  num: number | undefined,
  boundary: {[key: string]: any} | undefined,
  posGenerator: Vector3[] | undefined,
  dirGenerator: Vector3[] | undefined,
  inertialMass: number[] | undefined,
  momentInertia: number[] | undefined,
  movement: string | undefined,
  initialVelocity: Vector3[] | undefined,
  initialAngularVelocity: Vector3[] | undefined,
  maxForce: number[] | undefined,
  maxTorque: number[] | undefined,
  maxSpeed: number[] | undefined,
  maxAngVel: number[] | undefined,
  translationDamping: number[] | undefined,
  rotationDamping: number[] | undefined,
  wrap: string | undefined,
  queryRadius: number | undefined,
  safeRadius: number | undefined,
  merge: boolean | undefined,
  behaviours:  ((a: number) => Array<any> )| undefined,
  display: null | undefined,
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