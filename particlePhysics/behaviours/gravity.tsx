import { Vector3 } from "three";
import { Tparticle, TparticlePreBody } from "../types";
import vec from "../vetores";

export default function gravity(particle: TparticlePreBody) {
  let G = 1;

  const self: any = {
    title: "gravity",
    descripition: "",
    G,
    particle,
  };

  self["field"] = (pointInSpace: Vector3) => {
    let vecr = vec().copy(pointInSpace).sub(vec().copy(self.particle.pos));
    let versorr = vec().copy(vecr).setLength(1);
    let r = vecr.length();
    if (r > 1) {
      //security measure
      let g = vec().copy(versorr);
      g.multiplyScalar(-G * self.particle.inertialMass);
      g.divideScalar(r * r);
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

      let g = agent.physics.gravity.field(self.particle.pos);
      let Fg = g.multiplyScalar(self.particle.inertialMass);
      Fgres.add(Fg);
    });
    self.particle.acl.add(Fgres.divideScalar(self.particle.inertialMass));
  };

  self["hasMoved"] = (newState: TparticlePreBody) => {
    //no changes on the body need to be done
  };

  self["merge"] = (otherGravity: any) => {
    //mass merges by itself
  };

  particle.physics[self.title] = self;
}
