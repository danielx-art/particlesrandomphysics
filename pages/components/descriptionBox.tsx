import { useState } from "react";
import { usePconfig } from "../../context/context";
import { pickRandomConfig } from "../../particlePhysics/randomConfig";
import { TparticleSystem } from "../../particlePhysics/types";

const DescBox = ({
  particleSystem,
  descData,
}: {
  particleSystem: TparticleSystem;
  descData: { [key: string]: any };
}) => {
  const { lang, setLang } = usePconfig();

  const handleLangToggle = () => {
    switch (lang) {
      case "ptbr":
        setLang("en");
        break;
      case "en":
        setLang("ptbr");
        break;
    }
  };

  return (
    <div className="absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2 p-6 text-white cursor-default border-2 border-gray-800 bg-gray-900 bg-opacity-50 rounded backdrop-blur-sm max-h-[55vh] max-w-[90vw] overflow-scroll">
      {particleSystem.physics.map((item: any, index: number) => (
        <div key={index}>
          {" "}
          <p className="text-lg px-2 pb-1 w-fit rounded border-2 border-emerald-400 border-opacity-70">
            {item.title[lang]}
          </p>{" "}
          <p className="text-sm italic px-2 pt-1 pb-1 text-yellow-100">
            {descData.tracingField === item.title.en
              ? lang === "en"
                ? "(and its field lines)"
                : "(e suas linhas de campo)"
              : ""}
          </p>{" "}
          <p className="px-2 pt-1 pb-5">{item.description[lang]}</p>{" "}
        </div>
      ))}
      <button
        onClick={handleLangToggle}
        className="flex absolute top-1 right-2 text-xs"
      >
        <div className={lang === "ptbr" ? "text-gray-300" : "text-gray-500"}>
          PT-BR
        </div>
        <div className="px-2 text-gray-300"> / </div>
        <div className={lang === "en" ? "text-gray-300" : "text-gray-500"}>
          EN
        </div>
      </button>
    </div>
  );
};

export default DescBox;
