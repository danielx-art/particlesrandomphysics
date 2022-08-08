import { createContext, ReactNode, useContext, useState } from "react";
import { parallelepiped } from "../particlePhysics/shapes";
import { parametersType } from "../particlePhysics/types";
import vec from "../particlePhysics/vetores";

type psystConfigType = {
  pconfig: parametersType;
  setPconfig: (newConfig: parametersType) => void;
};

const initialPsystConfig: psystConfigType = {
  pconfig: {
    num: 0,
    boundary: parallelepiped(vec(0, 0, 0), 10, 10, 10),
    posGenerator: () => [vec()],
    dirGenerator: () => [vec()],
    inertialMassGenerator: () => [0],
    momentInertiaGenerator: () => [0],
    movementGenerator: () => true,
    initialVelocityGenerator: () => [vec()],
    initialAngularVelocityGenerator: () => [vec()],
    maxForceGenerator: () => [1],
    maxTorqueGenerator: () => [1],
    maxSpeedGenerator: () => [1],
    maxAngVelGenerator: () => [1],
    translationDampingGenerator: () => [1],
    rotationDampingGenerator: () => [1],
    wrap: () => [vec()],
    queryRadius: 10,
    safeRadius: 10,
    merge: false,
    behavioursGenerator: () => [],
    displayGenerator: null,
  },
  setPconfig: () => {},
};

const pContext = createContext<psystConfigType | null>(null);

type Props = {
  children: ReactNode;
};

export function pContextProvider({ children }: Props) {
  const [pconfig, setPconfig] = useState(initialPsystConfig.pconfig);
  const value = { pconfig, setPconfig };

  return <pContext.Provider value={value}>{children}</pContext.Provider>;
}

export function usePconfig() {
  return useContext(pContext) as psystConfigType;
}
