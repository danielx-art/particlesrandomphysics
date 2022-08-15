import { Vector3 } from "three";
import { Tparticle, TparticlePreBody } from "../types";
import vec from "../vetores";

export default function gravity(particle: TparticlePreBody) {
  let G = 100;

  const self = {
    title: "gravity",
    descripition: "",
    G,
    particle,

    field: (pointInSpace: Vector3) => {
      let vecr = vec().copy(pointInSpace).sub(particle.pos);
      let versorr = vec().copy(vecr).setLength(1);
      let r = vecr.length();
      if (r > 1) {
        //security measure
        let g = vec().copy(versorr);
        g.multiplyScalar(-G * particle.inertialMass);
        g.divideScalar(r * r);
        return g;
      }
      return vec();
    },

    forces: (agents: Tparticle[]) => {
      //console.log(agents); //debugg
      Array.isArray(agents) ? true : (agents = [agents]); //if only one is passed

      let Fgres = vec();

      agents.forEach(function (agent, i) {
        if (!agent.physics.gravity) {
          return;
        }

        let g = agent.physics.gravity.field(particle.pos);
        let Fg = g.multiplyScalar(particle.inertialMass);
        Fgres.add(Fg);
      });
      //console.log(Fgres); //debugg
      particle.acl.add(Fgres.divideScalar(particle.inertialMass));
    },

    hasMoved: (newState: TparticlePreBody) => {
      //no changes on the body need to be done
    },

    merge: (otherGravity: any) => {
      //mass merges by itself
    },
  };

  particle.physics[self.title] = self;
}
