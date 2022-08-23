import { Vector3 } from "three";
import { Tbehaviour, Tparticle, TparticlePreBody } from "../types";
import vec from "../vetores";

export default function magneticDipole(particle: TparticlePreBody) {
  let title = "magnet";
  let description =
    "particle behaves as it has a magnetic dipole moment, as a regular magnet with a north and south pole regardless of any electrical effects";
  let intensity = 1;

  return {
    metadata: { title, description, intensity },
    attach: function (particle: TparticlePreBody) {
      let self = {} as Tbehaviour;

      self["m"] = vec().copy(particle.dir);

      self["field"] = (pointInSpace: Vector3) => {
        let m = particle.physics.magnet.m;
        let vecr = vec().copy(pointInSpace).sub(vec().copy(particle.pos));
        let versorr = vec().copy(vecr).setLength(1);
        let r = vecr.length();
        if (r > 0) {
          /*note
            this is redundant since particle will only act on particles outside a "tooClose" or
            safeRadius as worked on the particleSystem and collisionDetection themselves
            */
          let B = vec().copy(versorr);
          B.multiplyScalar(3 * m.dot(versorr));
          B.sub(m);
          B.divideScalar(r * r * r);
          return B;
        }
        return vec();
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
          let dinf = 0.000000001;
          let Bx = agent.physics.magnet
            .field(vec(particle.pos.x + dinf, particle.pos.y, particle.pos.z))
            .sub(B)
            .divideScalar(dinf)
            .multiplyScalar(m.x);
          let By = agent.physics.magnet
            .field(vec(particle.pos.x, particle.pos.y + dinf, particle.pos.z))
            .sub(B)
            .divideScalar(dinf)
            .multiplyScalar(m.y);
          let Bz = agent.physics.magnet
            .field(vec(particle.pos.x, particle.pos.y, particle.pos.z + dinf))
            .sub(B)
            .divideScalar(dinf)
            .multiplyScalar(m.z);
          let Fmag = Bx.add(By).add(Bz);
          Fmagres.add(Fmag);

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
