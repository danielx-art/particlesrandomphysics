import { Canvas } from "@react-three/fiber";
import type { NextPage } from "next";
import Particles from "./components/particles";
import Buttons from "./components/buttons";
import OctaTreeBox from "./components/octaTreeBox";
import { usePconfig } from "../context/context";
import { useMemo, useState } from "react";
import createParticleSystem from "../particlePhysics/particleSystem";
import { TparticleSystem } from "../particlePhysics/types";
import CameraControls from "./components/cameraControls";
import Tracers, { SingleFieldTrace } from "./components/tracers";
import InfoBox from "./components/informationBox";
import DescBox from "./components/descriptionBox";

const Home: NextPage = () => {
  const { pconfig, setPconfig, pause } = usePconfig();

  const particleSystem: TparticleSystem | undefined = useMemo(() => {
    /* this will create a new particle system everytime
    pconfig is changed due to button press or it is first set
    with the new boundary dimensions from viewport as set above*/
    if (pconfig.num !== 0) {
      return createParticleSystem(pconfig);
    }
    return undefined;
  }, [pconfig]);

  const [toggleInfo, setToggleInfo] = useState(false);
  const handleToggleInfo = () => {
    setToggleInfo((toggle) => !toggle);
  };

  const [toggleDesc, setToggleDesc] = useState(false);
  const handleToggleDesc = () => {
    setToggleDesc((toggle) => !toggle);
  };

  const [descData, setDescData] = useState({} as { [key: string]: any });

  return (
    <div className="w-full h-full flex">
      <button
        className="absolute z-10 text-xs top-1 left-2 text-zinc-200 opacity-0 cursor-default focus:opacity-100"
        onClick={() => {
          console.log("config: ");
          console.log(pconfig);
          console.log("particle system: ");
          console.log(particleSystem);
        }}
      >
        log configs
      </button>
      <p className="text-1xl w-full text-center absolute"></p>
      <Canvas
        className="h-full w-full absolute bg-black"
        camera={{ position: [0, 0, 5] }}
        //linear={true}
      >
        <CameraControls {...{ pconfig, setPconfig }} />
        {particleSystem !== undefined && (
          <Particles {...{ particleSystem, pconfig, pause }} />
        )}
        {particleSystem !== undefined && <OctaTreeBox {...particleSystem} />}
        {particleSystem !== undefined && pconfig.tracingFields && (
          <Tracers {...{ particleSystem, pconfig, setDescData, pause }} />
        )}
      </Canvas>
      <Buttons
        {...{
          toggleInfo,
          setToggleInfo,
          toggleDesc,
          setToggleDesc,
          handleToggleInfo,
          handleToggleDesc,
        }}
      />
      {toggleInfo && <InfoBox />}
      {toggleDesc && particleSystem !== undefined && (
        <DescBox {...{ particleSystem, descData }} />
      )}
    </div>
  );
};

export default Home;
