import { Vector3 } from "three";
import { Tbehaviour, Tparticle, TparticlePreBody } from "../types";
import vec from "../vetores";

export default function ambientGravity(g: number = 0.01) {
  let metadata = {
    g,
    direction: vec(0, -1, 0),
    title: { en: "ambient gravity", ptbr: "gravidade do ambiente" },
    description: {
      en: "Constant gravitacional acceleration on a certain direction of the environment.",
      ptbr: "Aceleração gravitacional constante em uma certa direção no ambiente.",
    },
    fieldTraceable: true,
    trajectoryTraceable: true,
  };

  return {
    metadata,
    attach: function (particle: TparticlePreBody) {
      let self = {} as Tbehaviour;

      self["g"] = metadata.g;

      self["field"] = (pointInSpace: Vector3) => {
        return metadata.direction.setLength(metadata.g);
      };

      self["forces"] = (agents: Tparticle[]) => {
        Array.isArray(agents) ? true : (agents = [agents]); //if only one is passed
        let gres = self.field(vec()).divideScalar(particle.inertialMass);
        particle.acl.add(gres);
      };

      self["hasMoved"] = (newState: TparticlePreBody) => {
        //no changes on the body need to be done
      };

      self["merge"] = (otherBehaviour: any) => {
        //mass merges by itself
      };

      particle.physics[metadata.title.en] = self;
    },
  };
}
