import { Vector3 } from "three";
import { Iparallelepiped } from "../particlePhysics/shapes";

export interface IdefaultGenArgs {
  index: number;
  num: number;
  boundary: Iparallelepiped;
  positions: Vector3[];
}

export type Tgenerator = ({}: IdefaultGenArgs) =>
  | Vector3[]
  | Vector3
  | number[]
  | number
  | string[]
  | string
  | boolean[]
  | boolean
  | undefined;

export type parametersType = {
  num: number | undefined;
  boundary: { [key: string]: any } | undefined;
  posGenerator: (
    num: number,
    boundary: Iparallelepiped
  ) => Vector3[] | undefined;
  dirGenerator: Tgenerator;
  inertialMass: Tgenerator;
  momentInertia: Tgenerator;
  movement: Tgenerator;
  initialVelocity: Tgenerator;
  initialAngularVelocity: Tgenerator;
  maxForce: Tgenerator;
  maxTorque: Tgenerator;
  maxSpeed: Tgenerator;
  maxAngVel: Tgenerator;
  translationDamping: Tgenerator;
  rotationDamping: Tgenerator;
  wrap: Tgenerator; //todo
  queryRadius: number | undefined;
  safeRadius: number | undefined;
  merge: boolean | undefined; //todo
  behaviours: ((a: number) => Array<any>) | undefined; //todo
  display: null | undefined; //todo
};

// export const defaultSystemParameters: parametersType = {
//   num: 3,

//   boundary: parallelepiped(vec(), 100,100,100),

//   posGenerator: ,

//   dirGenerator: ,

//   inertialMass: ,
//   momentInertia: ,

//   movement: "dynamic",

//   initialVelocity: ,
//   initialAngularVelocity:,
//   maxForce: ,
//   maxTorque: ,
//   maxSpeed: ,
//   maxAngVel: ,
//   translationDamping: ,
//   rotationDamping: ,

//   wrap: "bounce",

//   queryRadius: 500,

//   safeRadius: 5,

//   merge: false,

//   behaviours: (i) => {
//     return [
//       {
//         type: "gravity",
//         G: 10,
//       },
//     ];
//   },

//   display: null,
// };
