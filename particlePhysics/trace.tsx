import * as THREE from "three";
import { TparticleSystem } from "./types";
import vec from "./vetores";

const trace = function (
  psystem: TparticleSystem,
  behaviourName: string,
  maxSteps: number,
  ds: number,
  start: THREE.Vector3[]
) {
  let variation = 0.2;
  //maxSteps += Math.floor((2 * Math.random() - 1) * variation);
  let stepsSoFar = start.length;
  let stepsToGo = maxSteps - stepsSoFar;
  let vertices = [] as THREE.Vector3[];

  if (stepsToGo === maxSteps) {
    let randomX =
      (Math.random() - 1 / 2) * psystem.boundary.w + psystem.boundary.x;
    let randomY =
      (Math.random() - 1 / 2) * psystem.boundary.h + psystem.boundary.y;
    let randomZ =
      (Math.random() - 1 / 2) * psystem.boundary.d + psystem.boundary.z;
    vertices.push(vec(randomX, randomY, randomZ)); //otherwise just use a random position
  } else {
    vertices.push(...start);
    vertices.shift();
  }

  for (let i = 0; i < stepsToGo - 1; i++) {
    let lastPosition = vertices[vertices.length - 1];
    let totalField = vec();
    psystem.particles.forEach((particle) => {
      let field = particle.physics[behaviourName].field(
        lastPosition
      ) as THREE.Vector3;
      totalField.add(field);
    });

    let newPosition = vec()
      .copy(lastPosition)
      .add(vec().copy(totalField).setLength(ds));
    if (psystem.boundary.contains(newPosition)) {
      vertices.push(newPosition);
    } else {
      let randomX =
        (Math.random() - 1 / 2) * psystem.boundary.w + psystem.boundary.x;
      let randomY =
        (Math.random() - 1 / 2) * psystem.boundary.h + psystem.boundary.y;
      let randomZ =
        (Math.random() - 1 / 2) * psystem.boundary.d + psystem.boundary.z;
      vertices = [vec(randomX, randomY, randomZ)]; //otherwise just use a random position
      i = 0;
    }

    let willRestart = Math.random() < 0.05 ? true : false;

    if (willRestart) {
      let randomX =
        (Math.random() - 1 / 2) * psystem.boundary.w + psystem.boundary.x;
      let randomY =
        (Math.random() - 1 / 2) * psystem.boundary.h + psystem.boundary.y;
      let randomZ =
        (Math.random() - 1 / 2) * psystem.boundary.d + psystem.boundary.z;
      vertices = [vec(randomX, randomY, randomZ)];
    }
  }

  return vertices;
};

export default trace;
