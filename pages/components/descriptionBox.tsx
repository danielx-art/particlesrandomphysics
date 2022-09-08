import { useState } from "react";
import { usePconfig } from "../../context/context";
import { pickRandomConfig } from "../../particlePhysics/randomConfig";
import { TparticleSystem } from "../../particlePhysics/types";

const DescBox = (particleSystem: TparticleSystem) => {
  return (
    <div className="absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2 p-6 text-white cursor-default border-2 border-gray-800 bg-gray-900 bg-opacity-50 rounded backdrop-blur-sm">
      {particleSystem.physics.map((item: any, index: number) => (
        <div key={index}>
          {" "}
          <p>{item.title}</p> <p>{item.description}</p>{" "}
        </div>
      ))}
    </div>
  );
};

export default DescBox;
