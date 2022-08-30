import { Vector3 } from "three";
import { Tbehaviour, Tparticle, TparticlePreBody } from "../types";
import vec from "../vetores";

export default function rgbDynamic(particle: TparticlePreBody) {
  let title = "rgbDynamic";
  let description =
    "inspired in color dynamics, but much simpler, particles are atracted to those with complementary 'color' - represented by a 3 vector with length 1 - and repelled by same color";
  let randomR = Math.random() < 0.5 ? 0 : 1;
  let randomG = Math.random() < 0.5 ? 0 : 1;
  let randomB = Math.random() < 0.5 ? 0 : 1;
  let color = vec(randomR, randomG, randomB).setLength(1);

  return {
    metadata: { title, description, color },
    attach: function (particle: TparticlePreBody) {
      let self = {} as Tbehaviour;

      self["color"] = color;

      self["field"] = (pointInSpace: Vector3) => {
        return vec().copy(self.color); //can the keyword 'this' acess this particle.physics.rgbDynamic object? test
      };

      self["forces"] = (agents: Tparticle[]) => {
        Array.isArray(agents) ? true : (agents = [agents]); //if only one is passed

        let Fres = vec();

        agents.forEach(function (agent, i) {
          if (!agent.physics.rgbDynamic) {
            return;
          }

          let vecr = vec().copy(agent.pos).sub(vec().copy(particle.pos));

          let C = agent.physics.rgbDynamic.field(particle.pos);

          //translation, force
          let colorDifference = vec().copy(C).sub(vec().copy(self.color)); //test with this keyword here

          Fres.add(vec().copy(vecr).setLength(C.length()));
        });

        particle.acl.add(Fres.divideScalar(particle.inertialMass));
      };

      self["hasMoved"] = (newState: TparticlePreBody) => {};

      self["merge"] = (otherRGB: any) => {
        let c2 = vec().copy(otherRGB.color);
        self.color.add(c2); //test this keyword here too
      };

      particle.physics[title] = self;
    },
  };
}
