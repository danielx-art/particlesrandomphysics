import { Vector3 } from "three";
import {
  TPrebehaviour,
  Tbehaviour,
  Tparticle,
  TparticlePreBody,
} from "../types";
import vec from "../vetores";

export default function hookesLawSoftBody(
  K: number = 1,
  Damp: number = 0,
  adjacencyList: number[][]
): TPrebehaviour {
  let metadata = {
    title: { en: "soft body", ptbr: "corpo macio" },
    description: {
      en: "Simulation of a soft body using hookes law to keep it together.",
      ptbr: "Simulação de um corpo macio usando a lei de hooke molas para conectar as partículas.",
    },
    K,
    Damp,
    adjacencyList,
    fieldTraceable: false,
    trajectoryTraceable: false,
  };

  return {
    metadata,
    attach: function (particle: TparticlePreBody) {
      let self = {} as Tbehaviour;

      //save neighboors and rest lengths (x0) at the moment of attachment
      let index = particle.index;
      //find the neighboors
      let neighboors = adjacencyList[index];

      type Tneighboor = {
        id: number;
        x0: number;
        neighboor?: Tparticle;
      };

      self["neighboors"] = neighboors.map((neigh) => {
        return { id: neigh, x0: -1 } as Tneighboor;
      });

      self["field"] = (pointInSpace: Vector3) => {};
      self["forces"] = (agents: Tparticle[]) => {
        Array.isArray(agents) ? true : (agents = [agents]); //if only one is passed
        //calculate x0s for the first time
        if (self.neighboors[0].x0 == -1) {
          self.neighboors.forEach((neigh: Tneighboor) => {
            let particleNeigh = agents.find(
              (agent) => agent.index === neigh.id
            ) as Tparticle; //its guaranteed since it is on the neighboors list
            let x0 = vec().copy(particle.pos).sub(particleNeigh.pos).length();
            neigh["x0"] = x0;
            neigh["neighboor"] = particleNeigh;
          });
        }

        let Fres = vec();

        self.neighboors.forEach((neigh: Tneighboor) => {
          if (neigh.neighboor !== undefined) {
            let x = vec().copy(neigh.neighboor.pos).sub(particle.pos);
            let x0vec = vec().copy(x).setLength(neigh.x0);
            let dx = vec().copy(x).sub(x0vec);
            let f = vec().copy(dx).multiplyScalar(metadata.K);
            //dampening
            let dvfac =
              vec().copy(particle.vel).sub(neigh.neighboor.vel).length() * Damp;
            f.multiplyScalar(2 - 1 / (dvfac + 1));
            Fres.add(f);
          }
        });
        particle.acl.add(Fres.divideScalar(particle.inertialMass));
      };

      self["hasMoved"] = (newState: TparticlePreBody) => {};

      self["merge"] = (otherVertice: any) => {};

      particle.physics[metadata.title.en] = self;
    },
  };
}
