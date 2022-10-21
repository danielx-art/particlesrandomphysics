import { Vector3 } from "three";
import { Tbehaviour, Tparticle, TparticlePreBody } from "../types";
import vec from "../vetores";

export default function rgbDynamic() {
  let randomR = Math.random() < 0.5 ? 0 : 1;
  let randomG = Math.random() < 0.5 ? 0 : 1;
  let randomB = Math.random() < 0.5 ? 0 : 1;
  let color = vec(randomR, randomG, randomB).setLength(1);

  let metadata = {
    title: { en: "rgbDynamic", ptbr: "dinânima RGB" },
    description: {
      en: "Inspired in chromodynamics, but much simpler, particles are atracted to those with complementary 'color' (represented by a 3 vector with length 1) and repelled by same color",
      ptbr: "Insparada em cromodinâmica, porém muito mais simples, as particulas são atraídas por aquelas que possuem uma 'cor' (representada por um vetor de 3 dimensões com norma 1) complementar, e são repelidas por cores semelhantes.",
    },
    color,
    fieldTraceable: false,
    tracetoryTraceable: true,
  };

  return {
    metadata,
    attach: function (particle: TparticlePreBody) {
      let self = {} as Tbehaviour;

      self["color"] = color;

      self["field"] = (pointInSpace: Vector3) => {
        return vec();
      };

      self["forces"] = (agents: Tparticle[]) => {
        Array.isArray(agents) ? true : (agents = [agents]); //if only one is passed

        let Fres = vec();

        agents.forEach(function (agent, i) {
          if (!agent.physics.rgbDynamic) {
            return;
          }

          //translation, force
          let colorDifference = vec()
            .copy(agent.physics.rgbDynamic.color)
            .sub(vec().copy(self.color))
            .lengthSq();
          let r = vec().copy(agent.pos).sub(vec().copy(particle.pos));
          let rmag = r.length() + 0.001;
          r.setLength(1).multiplyScalar(((colorDifference - 1.5) * 10) / rmag);
          Fres.add(r);
        });

        particle.acl.add(Fres.divideScalar(particle.inertialMass));
      };

      self["hasMoved"] = (newState: TparticlePreBody) => {};

      self["merge"] = (otherRGB: any) => {
        let c2 = vec().copy(otherRGB.color);
        self.color.add(c2); //test this keyword here too
      };

      particle.physics[metadata.title.en] = self;
    },
  };
}
