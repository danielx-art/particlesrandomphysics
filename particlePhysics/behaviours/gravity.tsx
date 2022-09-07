import { Vector3 } from "three";
import { Tbehaviour, Tparticle, TparticlePreBody } from "../types";
import vec from "../vetores";

export default function gravity(particle: TparticlePreBody) {
  let metadata = {
    G: 1,
    title: "gravity",
    description: "Newton's universal law of gravity between all particles",
    fieldTraceable: true,
    trajectoryTraceable: true,
  };

  return {
    metadata,
    attach: function (particle: TparticlePreBody) {
      let self = {} as Tbehaviour;

      self["G"] = metadata.G;

      self["field"] = (pointInSpace: Vector3) => {
        let vecr = vec().copy(pointInSpace).sub(vec().copy(particle.pos));
        let versorr = vec().copy(vecr).setLength(1);
        let r2 = vecr.lengthSq();
        if (r2 > 0.0001) {
          //security measure
          let g = vec().copy(versorr);
          g.multiplyScalar(-metadata.G * particle.inertialMass);
          g.divideScalar(r2);
          return g;
        }
        return vec();
      };
      self["forces"] = (agents: Tparticle[]) => {
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
      };
      self["hasMoved"] = (newState: TparticlePreBody) => {
        //no changes on the body need to be done
      };

      self["merge"] = (otherMagnet: any) => {
        //mass merges by itself
      };

      particle.physics[metadata.title] = self;
    },
  };
}
