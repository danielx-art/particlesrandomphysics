import { createContext, ReactNode, useContext, useState } from "react";
import { parametersType } from "../particlePhysics/default_parameters";

type psystConfigType = {
  pconfig: parametersType | undefined;
  setPconfig: (newConfig: parametersType) => void;
};

const initialPsystConfig: psystConfigType = {
  pconfig: undefined,
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
