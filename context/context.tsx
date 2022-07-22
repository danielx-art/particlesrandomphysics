import { createContext, ReactNode, useContext, useState } from "react";
import { defaultSystemParameters } from "../particlePhysics/particlePhysics/default_parameters";
import { parametersType } from "../particlePhysics/particlePhysics/default_parameters";

type psystConfigType = {
  pconfig: parametersType;
  setPconfig: (newConfig: parametersType) => void;
};

const initialPsystConfig: psystConfigType = {
  pconfig: defaultSystemParameters,
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
