import { Vector3 } from "three";
import { Tparticle, TparticlePreBody } from "../types";
import vec from "../vetores";

export default function gravity() {
  let G = 1;
  let title = "gravity";
  let description = "Newton's universal law of gravity between all particles";

  return {
    metadata: {
      title,
      description,
      G,
    },
    attach: function (particle: TparticlePreBody) {
      particle.physics[title] = {
        field: (pointInSpace: Vector3) => {
          let vecr = vec().copy(pointInSpace).sub(vec().copy(particle.pos));
          let versorr = vec().copy(vecr).setLength(1);
          let r2 = vecr.lengthSq();
          if (r2 > 0.0001) {
            //security measure
            let g = vec().copy(versorr);
            g.multiplyScalar(-G * particle.inertialMass);
            g.divideScalar(r2);
            return g;
          }
          return vec();
        },

        forces: (agents: Tparticle[]) => {
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
          particle.acl.add(Fgres.divideScalar(particle.inertialMass));
        },

        hasMoved: (newState: TparticlePreBody) => {
          //no changes on the body need to be done
        },

        merge: (otherGravity: any) => {
          //mass merges by itself
        },
      };
    },
  };
}
