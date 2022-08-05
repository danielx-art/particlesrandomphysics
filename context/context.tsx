import { createContext, ReactNode, useContext, useState } from "react";
import { parametersType } from "../particlePhysics/types";

type psystConfigType = {
  pconfig: parametersType;
  setPconfig: (newConfig: parametersType) => void;
};

const initialPsystConfig: psystConfigType = {
  pconfig: {
    num: 0,
    boundary: undefined,
    posGenerator: undefined,
    dirGenerator: undefined,
    inertialMassGenerator: undefined,
    momentInertiaGenerator: undefined,
    movementGenerator: undefined,
    initialVelocityGenerator: undefined,
    initialAngularVelocityGenerator: undefined,
    maxForceGenerator: undefined,
    maxTorqueGenerator: undefined,
    maxSpeedGenerator: undefined,
    maxAngVelGenerator: undefined,
    translationDampingGenerator: undefined,
    rotationDampingGenerator: undefined,
    wrap: undefined,
    queryRadius: undefined,
    safeRadius: undefined,
    merge: undefined,
    behavioursGenerator: undefined,
    displayGenerator: undefined,
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
