import { Vector3 } from "three";
import { Iparallelepiped } from "./shapes";

export interface IdefaultGenArgs {
  index: number;
  num: number;
  boundary: Iparallelepiped;
  positions: Vector3[];
}

export type Tgenerator = ({}: IdefaultGenArgs) => any;

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

export interface particleBody {
  pos: Vector3;
  dir: Vector3;
  inertialMass: number;
  momentInertia: number;
  movement: boolean;
  vel: Vector3;
  acl: Vector3;
  angvel: Vector3;
  angacl: Vector3;
  x: number;
  y: number;
  z: number;
}
