import { Vector3 } from "three";
import { TparticleSystem } from "./types";
import vec from "./vetores";

const trace = function (
  psystem: TparticleSystem,
  behaviourName: string,
  maxSteps: number,
  ds: number,
  start: Vector3[]
) {
  let randomX =
    (Math.random() - 1 / 2) * psystem.boundary.w + psystem.boundary.x;
  let randomY =
    (Math.random() - 1 / 2) * psystem.boundary.h + psystem.boundary.y;
  let randomZ =
    (Math.random() - 1 / 2) * psystem.boundary.d + psystem.boundary.z;

  let vertices = [] as THREE.Vector3[];

  if (start.length > 0) {
    vertices.push(...start); //start with previously calculated path
  } else {
    vertices.push(vec(randomX, randomY, randomZ)); //otherwise just use a random position
  }

  if (vertices.length > 1) {
    vertices.shift(); //if it already has more than one position, shift it to "advance" the line
  }

  let stepsToGo = maxSteps - vertices.length;

  for (let i = 0; i < stepsToGo; i++) {
    let lastPosition = vertices[vertices.length - 1];
    let totalField = vec();
    psystem.particles.forEach((particle) => {
      let field = particle.physics[behaviourName].field(
        lastPosition
      ) as Vector3;
      totalField.add(field);
    });
    totalField.multiplyScalar(ds);
    //console.log(totalField); //debugg
    let newPosition = vec().copy(lastPosition).add(totalField);
    if (
      psystem.boundary.contains(newPosition) &&
      totalField.lengthSq() > 0.0001 &&
      totalField.lengthSq() < 0.5
    ) {
      vertices.push(newPosition);
    } else {
      //if it gets out then do it again
      let restarted: THREE.Vector3[] = trace(
        psystem,
        behaviourName,
        maxSteps,
        ds,
        []
      );
      return restarted;
    }
  }

  return vertices;
};

export default trace;
