import { createContext, ReactNode, useContext, useState } from "react";
import { parametersType } from "../particlePhysics/types";

type psystConfigType = {
  pconfig: parametersType;
  setPconfig: (newConfig: parametersType) => void;
};

const initialPsystConfig: psystConfigType = {
  pconfig: {
    num: undefined,
    boundary: undefined,
    posGenerator: undefined,
    dirGenerator: undefined,
    inertialMass: undefined,
    momentInertia: undefined,
    movement: undefined,
    initialVelocity: undefined,
    initialAngularVelocity: undefined,
    maxForce: undefined,
    maxTorque: undefined,
    maxSpeed: undefined,
    maxAngVel: undefined,
    translationDamping: undefined,
    rotationDamping: undefined,
    wrap: undefined,
    queryRadius: undefined,
    safeRadius: undefined,
    merge: undefined,
    behaviours: undefined,
    display: undefined,
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
