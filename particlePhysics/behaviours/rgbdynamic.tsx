import { Vector3 } from "three";
import { Tparticle, TparticlePreBody } from "../types";
import vec from "../vetores";

export default function rgbDynamic(particle: TparticlePreBody) {
  let title = "rgbDynamic";
  let description =
     "inspired in color dynamics, but much simpler, particles are atracted to those with complementary 'color' - represented by a 3 vector with length 1 - and repelled by same color";
  let intensity = 1;

  return {
    metadata: { title, description, intensity },
    attach: function (particle: TparticlePreBody) {
      let randomR = Math.random() < 0.5 ? 0 : 1;
      let randomG = Math.random() < 0.5 ? 0 : 1;
      let randomB = Math.random() < 0.5 ? 0 : 1;
      let color = vec(randomR, randomG, randomB).setLength(1);

      particle.physics[title] = {
        color,

        field: (pointInSpace: Vector3) => {
          let vecr = vec().copy(pointInSpace).sub(vec().copy(particle.pos));
          let r = vecr.length();
          return vec().copy(this.color).multiplyScalar(r); //can the keyword 'this' acess this particle.physics.rgbDynamic object? test
        },

        forces: (agents: Tparticle[]) => {
          Array.isArray(agents) ? true : (agents = [agents]); //if only one is passed

          let Fres = vec();

          agents.forEach(function (agent, i) {
            if (!agent.physics.rgbDynamic) {
              return;
            }

            let C = agent.physics.rgbDynamic.field(particle.pos);

            //translation, force
            let colorDifference = vec().copy(C).sub(vec().copy(this.color)); //test with this keyword here

            Fres.add(colorDifference);

          });

          particle.acl.add(Fres.divideScalar(particle.inertialMass));
        },

        hasMoved: (newState: TparticlePreBody) => {

        },

        merge: (otherRGB: any) => {
          let c2 = vec().copy(otherRGB.color);
          this.color.add(c2); //test this keyword here too
        },
      };
    },
  };
}
