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
//import * as BEHAVIOURS_GENERATORS from "../particlePhysics/generators/behavioursGenerators"
//import * as DISPLAY_GENERATORS from "../particlePhysics/generators/displayGenerators"

function pickRandomGenerator<Type>(importedGeneratorsObj: {
  [char: string]: Type;
}) {
  let generators = Object.keys(importedGeneratorsObj);
  let randomGenerator = pickRandomItemsFromArray(generators, 1) as string;
  return importedGeneratorsObj[randomGenerator];
}

export function pickRandomConfig(preconfig: parametersType): parametersType {
  return {
    num: Math.round(Math.random() * 999 + 1),
    boundary: preconfig.boundary,
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
    queryRadius: preconfig.boundary ? preconfig.boundary.width / 3 : 10,
    safeRadius: 1,
    merge: Math.random() < 0.2 ? true : false,
    behavioursGenerator: pickRandomGenerator(BEHAVIOURS_GENERATORS),
    displayGenerator: pickRandomGenerator(DISPLAY_GENERATORS),
  };
}
