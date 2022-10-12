import { pickRandomItemsFromArray } from "../particlePhysics/helpers";
import { parametersType } from "./types";
import * as POS_GENERATORS from "../particlePhysics/generators/positionGenerators";
import * as DIR_GENERATORS from "../particlePhysics/generators/dirGenerators";
import * as INERTIALMASS_GENERATORS from "../particlePhysics/generators/inertialMassGenerators";
import * as MOMINERTIA_GENERATORS from "../particlePhysics/generators/momentInertiaGenerators";
import * as MOVEMENT_GENERATORS from "../particlePhysics/generators/movementGenerators";
import * as VEL_GENERATORS from "../particlePhysics/generators/velocityGenerators";
import * as ANGVEL_GENERATORS from "../particlePhysics/generators/angularVelocityGenerators";
import * as MAXFORCE_GENERATORS from "../particlePhysics/generators/maxForceGenerators";
import * as MAXTORQUE_GENERATORS from "../particlePhysics/generators/maxTorqueGenerators";
import * as MAXSPEED_GENERATORS from "../particlePhysics/generators/maxSpeedGenerators";
import * as MAXANGVEL_GENERATORS from "../particlePhysics/generators/maxAngVelGenerators";
import * as TDAMP_GENERATORS from "../particlePhysics/generators/translationDampingGenerators";
import * as RDAMP_GENERATORS from "../particlePhysics/generators/rotationDampingGenerators";
import * as WRAP_GENERATORS from "../particlePhysics/generators/wrapGenerators";
import * as BEHAVIOURS from "./generators/behaviours";
import * as CUSTOM_PARTICLE_GEOM from "./generators/particleGeometries";
import { Iparallelepiped, parallelepiped } from "./shapes";
import vec from "./vetores";
import { Tgenerator } from "./types";

function constantGenerator(a: any): Tgenerator {
  return {
    function: () => a,
    name: `constant`,
  };
}

function pickRandomGenerator<T>(importedGeneratorsObj: { [name: string]: T }): {
  function: T;
  name: string;
} {
  let generators = Object.keys(importedGeneratorsObj);
  let randomGenerator = pickRandomItemsFromArray(generators, 1) as string;
  let chosen = importedGeneratorsObj[randomGenerator];
  let chosenName = generators[generators.indexOf(randomGenerator)];
  return { function: chosen, name: chosenName };
}

function pickRandomBehaviour<T>(importedBehavioursObjList: {
  behaviours: T[];
}): T[] {
  let allBehaviours = importedBehavioursObjList.behaviours as T[];
  let randomNum = 1 + Math.floor(Math.random() * 2);
  let picked =
    randomNum === 1
      ? [pickRandomItemsFromArray(allBehaviours, 1)]
      : pickRandomItemsFromArray(allBehaviours, randomNum);
  return picked as T[];
}

export function totalRandomConfig(
  argsboundary: Iparallelepiped | undefined
): parametersType {
  let self: parametersType = {
    num: 1 + Math.round(Math.random() * 29),
    boundary: argsboundary
      ? argsboundary
      : parallelepiped(vec(0, 0, 0), 100, 100, 100),
    posGenerator: pickRandomGenerator(POS_GENERATORS),
    dirGenerator: pickRandomGenerator(DIR_GENERATORS),
    inertialMassGenerator: pickRandomGenerator(INERTIALMASS_GENERATORS),
    momentInertiaGenerator: pickRandomGenerator(MOMINERTIA_GENERATORS),
    movementGenerator: pickRandomGenerator(MOVEMENT_GENERATORS),
    initialVelocityGenerator: pickRandomGenerator(VEL_GENERATORS),
    initialAngularVelocityGenerator: pickRandomGenerator(ANGVEL_GENERATORS),
    maxForceGenerator: pickRandomGenerator(MAXFORCE_GENERATORS),
    maxTorqueGenerator: pickRandomGenerator(MAXTORQUE_GENERATORS),
    maxSpeedGenerator: pickRandomGenerator(MAXSPEED_GENERATORS),
    maxAngVelGenerator: pickRandomGenerator(MAXANGVEL_GENERATORS),
    translationDampingGenerator: pickRandomGenerator(TDAMP_GENERATORS),
    rotationDampingGenerator: pickRandomGenerator(RDAMP_GENERATORS),
    wrapGenerator: pickRandomGenerator(WRAP_GENERATORS),
    queryRadius: 100,
    safeRadius: 0.05,
    merge: false,
    behaviours: pickRandomBehaviour(BEHAVIOURS),
    tracingFields: (() => (Math.random() < 0.5 ? true : false))(),
    displayGenerator: CUSTOM_PARTICLE_GEOM.sqPyramid,
  };

  return self;
}

// export function totalRandomConfig(
//   argsboundary: Iparallelepiped | undefined
// ): parametersType {
//   let self: parametersType = {
//     num: 1 + Math.round(Math.random() * 29),
//     boundary: argsboundary
//       ? argsboundary
//       : parallelepiped(vec(0, 0, 0), 100, 100, 100),
//     posGenerator: pickRandomGenerator(POS_GENERATORS),
//     dirGenerator: pickRandomGenerator(DIR_GENERATORS),
//     inertialMassGenerator: pickRandomGenerator(INERTIALMASS_GENERATORS),
//     momentInertiaGenerator: pickRandomGenerator(MOMINERTIA_GENERATORS),
//     movementGenerator: pickRandomGenerator(MOVEMENT_GENERATORS),
//     initialVelocityGenerator: pickRandomGenerator(VEL_GENERATORS),
//     initialAngularVelocityGenerator: pickRandomGenerator(ANGVEL_GENERATORS),
//     maxForceGenerator: pickRandomGenerator(MAXFORCE_GENERATORS),
//     maxTorqueGenerator: pickRandomGenerator(MAXTORQUE_GENERATORS),
//     maxSpeedGenerator: pickRandomGenerator(MAXSPEED_GENERATORS),
//     maxAngVelGenerator: pickRandomGenerator(MAXANGVEL_GENERATORS),
//     translationDampingGenerator: pickRandomGenerator(TDAMP_GENERATORS),
//     rotationDampingGenerator: pickRandomGenerator(RDAMP_GENERATORS),
//     wrapGenerator: pickRandomGenerator(WRAP_GENERATORS),
//     queryRadius: 100,
//     safeRadius: 0.05,
//     merge: false,
//     behaviours: pickRandomBehaviour(BEHAVIOURS),
//     tracingFields: true,
//     displayGenerator: CUSTOM_PARTICLE_GEOM.sqPyramid,
//   };

//   return self;
// }

export function twoMagnetDipoles(
  argsboundary: Iparallelepiped | undefined
): parametersType {
  let self: parametersType = {
    num: 2,
    boundary: argsboundary
      ? argsboundary
      : parallelepiped(vec(0, 0, 0), 100, 100, 100),
    posGenerator: {
      function: (num, boundary) => [vec(0.6, 0.05, 0), vec(-0.6, -0.05, 0)],
      name: "two",
    },
    dirGenerator: {
      function: () => [vec(0, 1, 0), vec(0, 1, 0)],
      name: "twoup",
    },
    inertialMassGenerator: constantGenerator(1),
    momentInertiaGenerator: constantGenerator(1),
    movementGenerator: constantGenerator(true),
    initialVelocityGenerator: constantGenerator(vec(0, 0, 0)),
    initialAngularVelocityGenerator: constantGenerator(vec(0, 0, 0)),
    maxForceGenerator: constantGenerator(0.5),
    maxTorqueGenerator: constantGenerator(0.1),
    maxSpeedGenerator: constantGenerator(1),
    maxAngVelGenerator: constantGenerator(0.3),
    translationDampingGenerator: constantGenerator(1),
    rotationDampingGenerator: constantGenerator(0.9),
    wrapGenerator: pickRandomGenerator(WRAP_GENERATORS),
    queryRadius: 100,
    safeRadius: 0.01,
    merge: false,
    behaviours: [BEHAVIOURS.behaviours[0]],
    tracingFields: true,
    displayGenerator: CUSTOM_PARTICLE_GEOM.sqPyramid,
  };

  return self;
}

export function pickRandomConfig(
  argsboundary: Iparallelepiped | undefined
): parametersType {
  const configsList = [totalRandomConfig, twoMagnetDipoles];

  let chosenConfig =
    configsList[Math.floor(Math.max(Math.random() * configsList.length, 0))];

  return chosenConfig(argsboundary);
}
