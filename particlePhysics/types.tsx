import { Vector3 } from "three";
import { Iparallelepiped, Ishape } from "./shapes";

export interface IdefaultGenArgs {
  index: number;
  num: number;
  boundary: Iparallelepiped;
  positions: Vector3[];
}

export type Tposgenerator = (
  num: number,
  boundary: Iparallelepiped
) => Vector3[];

export type Tgenerator = ({}: IdefaultGenArgs) => any;

export type parametersType = {
  num: number;
  boundary: Iparallelepiped;
  posGenerator: Tposgenerator;
  dirGenerator: Tgenerator;
  inertialMassGenerator: Tgenerator;
  momentInertiaGenerator: Tgenerator;
  movementGenerator: Tgenerator;
  initialVelocityGenerator: Tgenerator;
  initialAngularVelocityGenerator: Tgenerator;
  maxForceGenerator: Tgenerator;
  maxTorqueGenerator: Tgenerator;
  maxSpeedGenerator: Tgenerator;
  maxAngVelGenerator: Tgenerator;
  translationDampingGenerator: Tgenerator;
  rotationDampingGenerator: Tgenerator;
  wrap: (
    particle: Tparticle,
    boundary: Iparallelepiped /*this in the future should be any shape*/
  ) => void;
  queryRadius: number;
  safeRadius: number;
  merge: boolean;
  behavioursGenerator: (a: number) => Array<any>; //todo
  displayGenerator: null; //todo
};

export type TparticlePreBody = {
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
  physics: { [behaviourTitle: string]: any };
};

export type Tparticle = TparticlePreBody & {
  applyForces: (agents: Tparticle[]) => void;
  move: () => {};
  merge: (p: Tparticle) => void;
};

export type TparticleSystem = {
  num: number;
  boundary: Iparallelepiped;
  wrap: (particle: Tparticle, boundary: Iparallelepiped) => void;
  queryRadius: number;
  safeRadius: number;
  merge: boolean;
  particles: Tparticle[];
  collisionDetection: Ttree;
  update: () => {};
  move: () => {};
};

export type Ttree = {
  boundary: Iparallelepiped;
  capacity: number;
  points: Tparticle[];
  divided: boolean;
  subTrees: Ttree[];
  subdivide: () => void;
  insert: (p: Tparticle) => void;
  query: (range: Ishape, found: Tparticle[]) => Tparticle[];
  remove: (p: Tparticle) => void;
  count: () => number;
};

/*note
We could have a type for behaviours, the pseudo-code for that is:
export type Tbehaviour = {
  title: string;
  description: string;
  [any number of properties it needs]: any;
  field: Vector3 => any;
  forces: Tparticle[] => void;
  hasMoved: TparticlePreBody => void;
  merge: Tbehaviour => void;
}
but the problem is of course the variable number of properties each behaviour should
be able to have
*/
