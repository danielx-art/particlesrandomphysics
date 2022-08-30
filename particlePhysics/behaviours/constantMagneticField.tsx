import { Vector3 } from "three";
import { Tbehaviour, Tparticle, TparticlePreBody } from "../types";
import vec from "../vetores";

export default function constantMagneticField(particle: TparticlePreBody) {
  let title = "constantMagneticField";
  let description = "constant magnetic field in a random direction";
  let intensity = 1;
  let direction = vec().randomDirection();

  return {
    metadata: { title, description, direction, intensity },
    attach: function (particle: TparticlePreBody) {
      let self = {} as Tbehaviour;

      self["B"] = direction.multiplyScalar(intensity);

      self["field"] = (pointInSpace: Vector3) => {
        return vec().copy(self.B);
      };
      self["forces"] = (agents: Tparticle[]) => {
        Array.isArray(agents) ? true : (agents = [agents]); //if only one is passed

        let Fmagres = vec();
        let Tmagres = vec();

        let m = particle.physics.magnet.m;

        agents.forEach(function (agent, i) {
          if (!agent.physics.magnet) {
            return;
          }

          let B = agent.physics.magnet.field(particle.pos);

          //translation, force
          //approximation of partial derivatives

          //rotation, alignment, torque
          Tmagres.add(vec().copy(m).cross(B));
        });

        particle.acl.add(Fmagres.divideScalar(particle.inertialMass));
        particle.angacl.add(Tmagres.divideScalar(particle.momentInertia));
      };
      self["hasMoved"] = (newState: TparticlePreBody) => {
        let m = particle.physics.magnet.m;
        let mmag = m.length();
        m.copy(newState.dir).setLength(mmag);
      };

      self["merge"] = (otherMagnet: any) => {
        let m = particle.physics.magnet.m;
        let m2 = vec().copy(otherMagnet.m);
        m.add(m2);
      };

      particle.physics[title] = self;
    },
  };
}
