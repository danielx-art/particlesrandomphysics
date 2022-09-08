import { useState } from "react";
import { usePconfig } from "../../context/context";
import { pickRandomConfig } from "../../particlePhysics/randomConfig";

const InfoBox = () => {
  const { pconfig, setPconfig } = usePconfig();
  const [lang, setLang] = useState("pt-br");
  const handleLangToggle = () => {
    switch (lang) {
      case "pt-br":
        console.log("here"); //test
        setLang("en");
        break;
      case "en":
        setLang("pt-br");
        break;
    }
  };

  return (
    <div className="absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2 p-6 text-white cursor-default border-2 border-gray-800 bg-gray-900 bg-opacity-50 rounded backdrop-blur-sm">
      {lang === "en" && (
        <>
          <p>
            Hit refresh (the big button) to randomize the particles count,
            overall physical behaviour and other visual effects. You can use
            your mouse or touch to rotate or zoom view.
          </p>
          <p className="text-gray-400">
            This is a particle system simulation made using react-three-fiber
            and some more. To know more about how this is done visit its page on{" "}
            <a
              href="https://github.com/danielx-art/particlesrandomphysics"
              target={"_blank"}
              className="text-emerald-500"
            >
              GitHub
            </a>
            .
          </p>
          <button
            onClick={handleLangToggle}
            className="flex absolute top-1 right-2 text-xs"
          >
            <div className="text-gray-500">PT-BR</div>
            <div className="px-2 text-gray-300"> / </div>
            <div className="text-gray-300">EN</div>
          </button>
        </>
      )}
      {lang === "pt-br" && (
        <>
          <p>
            Clique em "refresh" (o botão grande no meio) para escolher
            aleatoriamente novos número de partículas, física e outros efeitos
            visuais. Use os mouse ou os dedos para rotacionar ou dar zoom na
            visão.
          </p>
          <p className="text-gray-400">
            Essa é uma simulação de um sistema de partículas feita usando
            reac-three-fiber dentro outras bibliotecas. Para saber mais sobre
            como isso foi feito visite seu código no{" "}
            <a
              href="https://github.com/danielx-art/particlesrandomphysics"
              target={"_blank"}
              className="text-emerald-500"
            >
              GitHub
            </a>
            .
          </p>
          <button
            onClick={handleLangToggle}
            className="flex absolute top-1 right-2 text-xs"
          >
            <div className="text-gray-300">PT-BR</div>
            <div className="px-2 tex-gray-300"> / </div>
            <div className="text-gray-500">EN</div>
          </button>
        </>
      )}
    </div>
  );
};

export default InfoBox;
