import { Tparticle, TparticleSystem } from "./types";
import { Vector3 } from "three";
import vec from "./vetores";

const trace = function (
  particleSystem: TparticleSystem,
  physics: string,
  steps: number,
  detail: number,
  from: Vector3[],
  filter?: (particle: Tparticle) => Tparticle[]
) {
  let agents = filter
    ? particleSystem.particles.filter(filter)
    : particleSystem.particles;

  let tracing = [...from] as THREE.Vector3[];

  let randomVectorInBounbdary = () => {
    let randomX = ((Math.random() - 1 / 2) * particleSystem.boundary.w +
      particleSystem.boundary.x) as number;
    let randomY = ((Math.random() - 1 / 2) * particleSystem.boundary.h +
      particleSystem.boundary.y) as number;
    let randomZ = ((Math.random() - 1 / 2) * particleSystem.boundary.d +
      particleSystem.boundary.z) as number;
    return vec(randomX, randomY, randomZ);
  };

  if (tracing.length === 0) {
    tracing = [randomVectorInBounbdary()];
  }

  let stepsToGo = steps - tracing.length;

  for (let i = 1; i < stepsToGo; i++) {
    let lastPosition = tracing[tracing.length - 1];

    let totalField = vec();
    agents.forEach((particle) => {
      let field = particle["physics"][physics]
        ? (particle["physics"][physics].field(lastPosition) as THREE.Vector3)
        : vec(0, 0, 0);
      totalField.add(field);
    });

    let newPosition = vec()
      .copy(lastPosition)
      .add(vec().copy(totalField).setLength(detail));
    if (particleSystem.boundary.contains(newPosition)) {
      tracing.push(newPosition);
    } else {
      tracing.push(lastPosition);
    }
  }
  return tracing;
};

export default trace;
