import { createContext, ReactNode, useContext, useState } from "react";
import { pickRandomConfig } from "../particlePhysics/randomConfig";
import { parallelepiped } from "../particlePhysics/shapes";
import { parametersType } from "../particlePhysics/types";
import vec from "../particlePhysics/vetores";

export type psystConfigType = {
  pconfig: parametersType;
  setPconfig: React.Dispatch<React.SetStateAction<parametersType>>;
};

// const initialPsystConfig: psystConfigType = {
//   pconfig: {
//     num: 0,
//     boundary: parallelepiped(vec(0, 0, 0), 10, 10, 10),
//     posGenerator: () => [vec()],
//     dirGenerator: () => [vec()],
//     inertialMassGenerator: () => [0],
//     momentInertiaGenerator: () => [0],
//     movementGenerator: () => true,
//     initialVelocityGenerator: () => [vec()],
//     initialAngularVelocityGenerator: () => [vec()],
//     maxForceGenerator: () => [1],
//     maxTorqueGenerator: () => [1],
//     maxSpeedGenerator: () => [1],
//     maxAngVelGenerator: () => [1],
//     translationDampingGenerator: () => [1],
//     rotationDampingGenerator: () => [1],
//     wrap: () => [vec()],
//     queryRadius: 10,
//     safeRadius: 10,
//     merge: false,
//     behaviours: [],
//     displayGenerator: null,
//   },
//   setPconfig: () => {},
// };

const initialPsystConfig = pickRandomConfig(
  parallelepiped(vec(0, 0, 0), 10, 10, 10)
);

const PContext = createContext<psystConfigType>({} as psystConfigType);

type Props = {
  children: ReactNode;
};

export function PContextProvider({ children }: Props) {
  const [pconfig, setPconfig] = useState(initialPsystConfig);
  const value = { pconfig, setPconfig };

  return <PContext.Provider value={value}>{children}</PContext.Provider>;
}

export function usePconfig() {
  return useContext(PContext) as psystConfigType;
}
