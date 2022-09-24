import { Vector3 } from "three";
import { Iparallelepiped, Ishape } from "./shapes";

export interface IdefaultGenArgs {
  index: number;
  num: number;
  boundary: Iparallelepiped;
  positions: Vector3[];
}

export type Tposgeneratorfunction = (
  num: number,
  boundary: Iparallelepiped
) => Vector3[];

export type Tposgenerator = {
  function: Tposgeneratorfunction,
  name: string
}

export type Tgeneratorfunction = ({}: IdefaultGenArgs) => any;

export type Tgenerator = {
  function: Tgeneratorfunction, 
  name: string
}

export type Twrapfunction = (
  particle: Tparticle,
  boundary: Iparallelepiped
) => void;

export type Twrap = {
  function: Twrapfunction, 
  name: string
}

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
  wrapGenerator: Twrap;
  queryRadius: number;
  safeRadius: number;
  merge: boolean;
  behaviours: any[];
  displayGenerator: any;
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
  physics: { [behaviourTitle: string]: Tbehaviour };
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
  physics: {
    title: { en: string; ptbr: string };
    description: { en: string; ptbr: string };
    [key: string]: any;
  };
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

export type Tbehaviour = {
  field: (pointInSpace: Vector3) => Vector3;
  forces: (agents: Tparticle[]) => void;
  hasMoved: (newState: TparticlePreBody) => void;
  merge: (otherThis: Tbehaviour) => void;
  [otherProperties: string]: any;
};
