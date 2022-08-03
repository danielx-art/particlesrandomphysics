import { pickRandomItemsFromArray } from "../particlePhysics/helpers";
import { parametersType } from "./typeParameters";
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
//import * as WRAP_GENERATORS from "../particlePhysics/generators/wrapGenerators"
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
    num: Math.round(Math.random() * 1000),
    boundary: preconfig.boundary,
    posGenerator: pickRandomGenerator(POS_GENERATORS),
    dirGenerator: pickRandomGenerator(DIR_GENERATORS),
    inertialMass: pickRandomGenerator(INERTIALMASS_GENERATORS),
    momentInertia: pickRandomGenerator(MOMINERTIA_GENERATORS),
    movement: pickRandomGenerator(MOVEMENT_GENERATORS),
    initialVelocity: pickRandomGenerator(VEL_GENERATORS),
    initialAngularVelocity: pickRandomGenerator(ANGVEL_GENERATORS),
    maxForce: pickRandomGenerator(MAXFORCE_GENERATORS),
    maxTorque: pickRandomGenerator(MAXTORQUE_GENERATORS),
    maxSpeed: pickRandomGenerator(MAXSPEED_GENERATORS),
    maxAngVel: pickRandomGenerator(MAXANGVEL_GENERATORS),
    translationDamping: pickRandomGenerator(TDAMP_GENERATORS),
    rotationDamping: pickRandomGenerator(RDAMP_GENERATORS),
    wrap: pickRandomGenerator(WRAP_GENERATORS),
    queryRadius: preconfig.boundary.w / 3,
    safeRadius: 4,
    merge: false, //make this random maybe
    behaviours: pickRandomGenerator(BEHAVIOURS_GENERATORS),
    display: pickRandomGenerator(DISPLAY_GENERATORS),
  };
}
