import { createContext, ReactNode, useContext, useState } from "react";

type psystConfigType = {};

const psystConfig: psystConfigType = {};

const pContext = createContext<psystConfigType | null>(psystConfig);

export function usePconfig() {
  return useContext(pContext) as psystConfigType;
}

type Props = {
  children: ReactNode;
};

export function pContextProvider({ children }: Props) {
  //put all values for particle system here that will be randomized as we press refresh
  const value = {};

  return (
    <>
      <pContext.Provider value={value}>{children}</pContext.Provider>
    </>
  );
}
