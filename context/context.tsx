import { createContext, ReactNode, useContext, useState } from "react";
import { pickRandomConfig } from "../particlePhysics/randomConfig";
import { parallelepiped } from "../particlePhysics/shapes";
import { parametersType } from "../particlePhysics/types";
import vec from "../particlePhysics/vetores";

export type configType = {
  pconfig: parametersType;
  setPconfig: React.Dispatch<React.SetStateAction<parametersType>>;
  lang: string;
  setLang: React.Dispatch<React.SetStateAction<string>>;
};

const initialPsystConfig = pickRandomConfig(
  parallelepiped(vec(0, 0, 0), 20, 20, 20)
);

const PContext = createContext<configType>({} as configType);

type Props = {
  children: ReactNode;
};

export function PContextProvider({ children }: Props) {
  const [pconfig, setPconfig] = useState(initialPsystConfig);
  const [lang, setLang] = useState("ptbr");
  const value = { pconfig, setPconfig, lang, setLang };

  return <PContext.Provider value={value}>{children}</PContext.Provider>;
}

export function usePconfig() {
  return useContext(PContext) as configType;
}
