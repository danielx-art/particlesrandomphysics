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
//import * as DISPLAY_GENERATORS from "../particlePhysics/generators/displayGenerators"

console.log(DIR_GENERATORS); //test & debugg

function pickRandomGenerator<Type>(importedGeneratorsObj: {
  [char: string]: Type; // is this char already the name of the generator?
}) {
  let generators = Object.keys(importedGeneratorsObj);
  let randomGenerator = pickRandomItemsFromArray(generators, 1) as string;
  return importedGeneratorsObj[randomGenerator];
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
    wrap: pickRandomGenerator(WRAP_GENERATORS),
    queryRadius: 100,
    safeRadius: 0.05,
    merge: false,
    behaviours: pickRandomBehaviour(BEHAVIOURS),
    displayGenerator: CUSTOM_PARTICLE_GEOM.sqPyramid,
  };

  return self;
}

/* TESTING */
export function testConfig(
  argsboundary: Iparallelepiped | undefined
): parametersType {
  let self: parametersType = {
    num: 2,
    boundary: argsboundary
      ? argsboundary
      : parallelepiped(vec(0, 0, 0), 100, 100, 100),
    posGenerator: (num, boundary) => [vec(1, 0.5, 0), vec(-1, -0.5, 0)],
    dirGenerator: () => [vec(0, 1, 0), vec(0, 1, 0)],
    inertialMassGenerator: () => 1,
    momentInertiaGenerator: () => 1,
    movementGenerator: () => true,
    initialVelocityGenerator: () => vec(0, 0, 0),
    initialAngularVelocityGenerator: () => vec(0, 0, 0),
    maxForceGenerator: () => 0.8,
    maxTorqueGenerator: () => 0.5,
    maxSpeedGenerator: () => 1,
    maxAngVelGenerator: () => 0.1,
    translationDampingGenerator: () => 1,
    rotationDampingGenerator: () => 1,
    wrap: pickRandomGenerator(WRAP_GENERATORS),
    queryRadius: 100,
    safeRadius: 0.05,
    merge: false,
    behaviours: pickRandomBehaviour(BEHAVIOURS),
    displayGenerator: CUSTOM_PARTICLE_GEOM.sqPyramid, //create more
  };

  return self;
}

export function pickRandomConfig(
  argsboundary: Iparallelepiped | undefined
): parametersType {
  const configsList = [testConfig, totalRandomConfig];

  let chosenConfig =
    configsList[Math.floor(Math.max(Math.random() * configsList.length, 0))];

  return chosenConfig(argsboundary);
}
