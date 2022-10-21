import { Vector3 } from "three";
import { Tbehaviour, Tparticle, TparticlePreBody } from "../types";
import vec from "../vetores";

export default function boids() {
  let metadata = {
    title: { en: "boids", ptbr: "boids" },
    description: {
      en: "Simulates flocking behaviours (such as birds) with laws of cohesion, separation and alignment",
      ptbr: "Simula comportamento de formação de aglomerados (como em pássaros) com leis de coesão, separação e alinhamento",
    },
    intensity: [0.001, 0.001, 0.01, (2 * Math.PI) / 3, 0.00005],
    fieldTraceable: false,
    trajectoryTraceable: true,
  };

  return {
    metadata,
    attach: function (particle: TparticlePreBody) {
      let self = {} as Tbehaviour;

      let dir = particle.dir;
      let pos = particle.pos;
      let C = metadata.intensity[0];
      let S = metadata.intensity[1];
      let A = metadata.intensity[2];
      let fov = metadata.intensity[3];
      let NoiseFactor = metadata.intensity[4];

      self["field"] = (pointInSpace: Vector3) => {
        return vec();
      };

      self["forces"] = (agents: Tparticle[]) => {
        Array.isArray(agents) ? true : (agents = [agents]); //if only one is passed

        let Fres = vec();
        let rcm = vec(); //mean position for cohesion

        agents.forEach(function (agent, i) {
          if (!agent.physics[metadata.title.en]) {
            return;
          }

          let viewDir = dir.angleTo(agent.pos);
          //let fovFactor = Math.exp(-(viewDir * viewDir) / (fov * fov));
          let fovFactor = viewDir < fov ? 1 : 0.1;
          let r = vec().copy(agent.pos).sub(pos); //from this to agent (positive means attraction)
          let r2 = r.lengthSq();

          //cohesion - part 1
          rcm.add(
            vec()
              .copy(agent.pos)
              .multiplyScalar(fovFactor / agents.length)
          );

          //separation
          let fs = vec()
            .copy(r)
            .setLength((-S * fovFactor) / r2);
          Fres.add(fs);

          //aligment
          let adir = vec().copy(agent.dir);
          let fa = adir.multiplyScalar((A * fovFactor) / (agents.length * r2));
          Fres.add(fa);

          //ruido
          let noise = vec().randomDirection().multiplyScalar(NoiseFactor);
          Fres.add(noise);

          //visão limpa
        });

        //cohesion - part 2
        let fc = vec().copy(rcm).sub(pos).multiplyScalar(C);
        Fres.add(fc);

        particle.acl.add(Fres.divideScalar(particle.inertialMass));
      };

      self["hasMoved"] = (newState: TparticlePreBody) => {
        let vV = vec().copy(newState.vel).setLength(1);
        newState.dir.set(vV.x, vV.y, vV.z);
      };

      self["merge"] = (otherBoid: any) => {};

      particle.physics[metadata.title.en] = self;
    },
  };
}
