import { pickRandomItemsFromArray } from "../particlePhysics/helpers";
import { behavioursFunction, parametersType, TPrebehaviour } from "./types";
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
import { Vector3 } from "three";
import { default as hookesLawSoftBody } from "./behaviours/hookesLaw";

function constantGenerator(a: number | boolean): Tgenerator {
  return {
    function: () => a,
    name: `constant`,
  };
}

function constantVectorGenerator(a: Vector3): Tgenerator {
  return {
    function: () => vec().copy(a),
    name: `constant vector`,
  };
}

function makeRandomGenerator<T>(importedGeneratorsObj: { [name: string]: T }): {
  function: T;
  name: string;
} {
  let generators = Object.keys(importedGeneratorsObj);
  let randomGenerator = pickRandomItemsFromArray(generators, 1) as string;
  let chosen = importedGeneratorsObj[randomGenerator];
  let chosenName = generators[generators.indexOf(randomGenerator)];
  return { function: chosen, name: chosenName };
}

function pickRandomGenerator<T>(importedGeneratorsObj: { [name: string]: T }) {
  let generators = Object.keys(importedGeneratorsObj);
  let randomGenerator = pickRandomItemsFromArray(generators, 1) as string;
  let chosen = importedGeneratorsObj[randomGenerator];
  return chosen;
}

function pickRandomBehaviours(importedBehavioursObjList: {
  behaviours: { [name: string]: behavioursFunction };
}): TPrebehaviour[] {
  let allBehaviours = Object.keys(importedBehavioursObjList.behaviours);
  let randomNum = 1 + Math.floor(Math.random() * 2);

  let picked =
    randomNum === 1
      ? ([pickRandomItemsFromArray(allBehaviours, 1)] as string[])
      : (pickRandomItemsFromArray(allBehaviours, randomNum) as string[]);

  let callPicked = picked.map((item) =>
    importedBehavioursObjList.behaviours[item]()
  );

  return callPicked;
}

/*---------------------------------------------------------------------
--------------------------RANDOM CONFIG--------------------------------
----------------------------------------------------------------------*/
export function totalRandomConfig(
  argsboundary: Iparallelepiped | undefined
): parametersType {
  let self: parametersType = {
    num: 1 + Math.round(Math.random() * 29),
    boundary: argsboundary
      ? argsboundary
      : parallelepiped(vec(0, 0, 0), 100, 100, 100),
    posGenerator: makeRandomGenerator(POS_GENERATORS),
    dirGenerator: makeRandomGenerator(DIR_GENERATORS),
    inertialMassGenerator: makeRandomGenerator(INERTIALMASS_GENERATORS),
    momentInertiaGenerator: makeRandomGenerator(MOMINERTIA_GENERATORS),
    movementGenerator: makeRandomGenerator(MOVEMENT_GENERATORS),
    initialVelocityGenerator: makeRandomGenerator(VEL_GENERATORS),
    initialAngularVelocityGenerator: makeRandomGenerator(ANGVEL_GENERATORS),
    maxForceGenerator: makeRandomGenerator(MAXFORCE_GENERATORS),
    maxTorqueGenerator: makeRandomGenerator(MAXTORQUE_GENERATORS),
    maxSpeedGenerator: makeRandomGenerator(MAXSPEED_GENERATORS),
    maxAngVelGenerator: makeRandomGenerator(MAXANGVEL_GENERATORS),
    translationDampingGenerator: makeRandomGenerator(TDAMP_GENERATORS),
    rotationDampingGenerator: makeRandomGenerator(RDAMP_GENERATORS),
    wrapGenerator: pickRandomGenerator(WRAP_GENERATORS)(),
    queryRadius: 100,
    safeRadius: 0.05,
    merge: false,
    behaviours: pickRandomBehaviours(BEHAVIOURS),
    tracingFields: (() => (Math.random() < 0.5 ? true : false))(),
    displayGenerator: CUSTOM_PARTICLE_GEOM.sqPyramid,
  };

  return self;
}

/*---------------------------------------------------------------------
--------------------------TWO MAGNETS----------------------------------
----------------------------------------------------------------------*/
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
    momentInertiaGenerator: constantGenerator(0.1),
    movementGenerator: constantGenerator(true),
    initialVelocityGenerator: constantVectorGenerator(vec(0, 0, 0)),
    initialAngularVelocityGenerator: constantVectorGenerator(vec(0, 0, 0)),
    maxForceGenerator: constantGenerator(0.3),
    maxTorqueGenerator: constantGenerator(1),
    maxSpeedGenerator: constantGenerator(0.1),
    maxAngVelGenerator: constantGenerator(1),
    translationDampingGenerator: constantGenerator(0.92),
    rotationDampingGenerator: constantGenerator(0.9),
    wrapGenerator: pickRandomGenerator(WRAP_GENERATORS)(),
    queryRadius: 1000,
    safeRadius: 0.05,
    merge: false,
    behaviours: [BEHAVIOURS.behaviours.magneticDipole()],
    tracingFields: true,
    displayGenerator: CUSTOM_PARTICLE_GEOM.sqPyramid,
  };

  return self;
}

/*---------------------------------------------------------------------
----------------------------TEST CONFIG--------------------------------
----------------------------------------------------------------------*/

export function testConfig(
  argsboundary: Iparallelepiped | undefined
): parametersType {
  let self: parametersType = {
    num: 20,
    boundary: argsboundary
      ? argsboundary
      : parallelepiped(vec(0, 0, 0), 100, 100, 100),
    posGenerator: makeRandomGenerator(POS_GENERATORS),
    dirGenerator: makeRandomGenerator(DIR_GENERATORS),
    inertialMassGenerator: makeRandomGenerator(INERTIALMASS_GENERATORS),
    momentInertiaGenerator: makeRandomGenerator(MOMINERTIA_GENERATORS),
    movementGenerator: makeRandomGenerator(MOVEMENT_GENERATORS),
    initialVelocityGenerator: makeRandomGenerator(VEL_GENERATORS),
    initialAngularVelocityGenerator: makeRandomGenerator(ANGVEL_GENERATORS),
    maxForceGenerator: makeRandomGenerator(MAXFORCE_GENERATORS),
    maxTorqueGenerator: makeRandomGenerator(MAXTORQUE_GENERATORS),
    maxSpeedGenerator: makeRandomGenerator(MAXSPEED_GENERATORS),
    maxAngVelGenerator: makeRandomGenerator(MAXANGVEL_GENERATORS),
    translationDampingGenerator: constantGenerator(1),
    rotationDampingGenerator: makeRandomGenerator(RDAMP_GENERATORS),
    wrapGenerator: pickRandomGenerator(WRAP_GENERATORS)(),
    queryRadius: 100,
    safeRadius: 0.05,
    merge: false,
    behaviours: [BEHAVIOURS.behaviours.boids()],
    tracingFields: false,
    displayGenerator: CUSTOM_PARTICLE_GEOM.sqPyramid,
  };

  return self;
}

/*---------------------------------------------------------------------
----------------------------LORENTZ FORCE------------------------------
----------------------------------------------------------------------*/

/*---------------------------------------------------------------------
-------------------------------BOIDS-----------------------------------
----------------------------------------------------------------------*/
export function boidsConfig(
  argsboundary: Iparallelepiped | undefined
): parametersType {
  let self: parametersType = {
    num: 20 + Math.round(Math.random() * 80),
    boundary: argsboundary
      ? argsboundary
      : parallelepiped(vec(0, 0, 0), 100, 100, 100),
    posGenerator: makeRandomGenerator(POS_GENERATORS),
    dirGenerator: makeRandomGenerator(DIR_GENERATORS),
    inertialMassGenerator: constantGenerator(1),
    momentInertiaGenerator: constantGenerator(1),
    movementGenerator: constantGenerator(true),
    initialVelocityGenerator: makeRandomGenerator(VEL_GENERATORS),
    initialAngularVelocityGenerator: constantVectorGenerator(vec()),
    maxForceGenerator: constantGenerator(0.05),
    maxTorqueGenerator: constantGenerator(0.5),
    maxSpeedGenerator: constantGenerator(0.1),
    maxAngVelGenerator: constantGenerator(0.5),
    translationDampingGenerator: constantGenerator(1),
    rotationDampingGenerator: constantGenerator(1),
    wrapGenerator: WRAP_GENERATORS.wrapAroundGenerator(),
    queryRadius: 50,
    safeRadius: 0.02,
    merge: false,
    behaviours: [BEHAVIOURS.behaviours.boids()],
    tracingFields: false,
    displayGenerator: CUSTOM_PARTICLE_GEOM.sqPyramid,
  };

  return self;
}

/*---------------------------------------------------------------------
-----------------------------SOFT BODY---------------------------------
----------------------------------------------------------------------*/
export function softBodiesConfig(
  argsboundary: Iparallelepiped | undefined
): parametersType {
  let boundary = argsboundary
    ? argsboundary
    : parallelepiped(vec(0, 0, 0), 100, 100, 100);

  let minDim = Math.min(boundary.w, boundary.h, boundary.d);

  let numberOfCubes = Math.round(Math.random() * 2) + 1; //1, 2 or 3
  //let numberOfCubes = 1; //test

  //on the hookes law, dont attach hookes law force object if index is out of range, than keep track of adjecncy list of connected points.

  let allVertices = [] as Vector3[];

  let adjacencyList = [] as number[][];

  let total = 0;

  for (let n = 1; n <= numberOfCubes; n++) {
    let randomCubeBorderBoxSide =
      numberOfCubes === 1
        ? (Math.random() * minDim) / 2 + minDim / 2
        : (Math.random() * minDim * 3) / 10 + minDim / 10;
    let randomCubeCenter = vec()
      .randomDirection()
      .setLength(Math.max(minDim / 2 - randomCubeBorderBoxSide, 0));

    let rank = Math.round(Math.random() * 2 + 2); //2, 3 or 4
    //let rank = 2; //test

    let cubeNumberVertices = rank * rank * rank;

    let cubeVertices = POS_GENERATORS.pointsOnA3DCubicGrid(
      cubeNumberVertices,
      boundary,
      randomCubeBorderBoxSide,
      randomCubeCenter
    );

    cubeVertices.forEach((vertex, index) => {
      let n = rank;

      let k0 = Math.floor(index / (n * n));
      let i0 = Math.floor((index - k0 * n * n) / n);
      let j0 = index - i0 * n - k0 * n * n;

      //then find its neighboors
      for (let dk = -1; dk <= 1; dk++) {
        for (let di = -1; di <= 1; di++) {
          for (let dj = -1; dj <= 1; dj++) {
            if (
              j0 + dj < 0 ||
              j0 + dj >= n ||
              i0 + di < 0 ||
              i0 + di >= n ||
              k0 + dk < 0 ||
              k0 + dk >= n ||
              (dk == 0 && di == 0 && dj == 0) ||
              Math.abs(dk * di * dj) == 1
            )
              continue;
            let neighId = j0 + dj + (i0 + di) * n + (k0 + dk) * n * n;
            if (adjacencyList[index + total] === undefined)
              adjacencyList[index + total] = [] as number[];
            adjacencyList[index + total].push(total + neighId);
          }
        }
      }
    });

    total += cubeNumberVertices;

    allVertices.push(...cubeVertices);
  }

  let hookesLaw = hookesLawSoftBody(0.1, 10, adjacencyList);

  let self: parametersType = {
    num: total,
    boundary,
    posGenerator: {
      function: (num, boundary) => allVertices,
      name: "points on cubes",
    },
    dirGenerator: makeRandomGenerator(DIR_GENERATORS),
    inertialMassGenerator: constantGenerator(1),
    momentInertiaGenerator: constantGenerator(1),
    movementGenerator: constantGenerator(true),
    initialVelocityGenerator: constantVectorGenerator(vec(0, 0, 0)),
    initialAngularVelocityGenerator: constantVectorGenerator(vec()),
    maxForceGenerator: constantGenerator(0.1),
    maxTorqueGenerator: constantGenerator(0.5),
    maxSpeedGenerator: constantGenerator(0.2),
    maxAngVelGenerator: constantGenerator(0.5),
    translationDampingGenerator: constantGenerator(1),
    rotationDampingGenerator: constantGenerator(1),
    wrapGenerator: WRAP_GENERATORS.wrapBounceGenerator(0.98),
    queryRadius: 300,
    safeRadius: 0.02,
    merge: false,
    behaviours: [hookesLaw, BEHAVIOURS.behaviours.ambientGravity(0.001)],
    tracingFields: false,
    displayGenerator: CUSTOM_PARTICLE_GEOM.sqPyramid,
  };

  return self;
}

/*---------------------------------------------------------------------
--------------------------CONFIG CHOOSING------------------------------
----------------------------------------------------------------------*/
export function pickRandomConfig(
  argsboundary: Iparallelepiped | undefined
): parametersType {
  //const configsList = [boidsConfig]; //test
  const configsList = [
    totalRandomConfig,
    twoMagnetDipoles,
    boidsConfig,
    softBodiesConfig,
  ];
  let chosenConfig =
    configsList[Math.floor(Math.max(Math.random() * configsList.length, 0))];

  return chosenConfig(argsboundary);
}
