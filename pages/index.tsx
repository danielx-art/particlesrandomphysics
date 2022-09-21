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
  const { pconfig, setPconfig } = usePconfig();

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
      <p className="text-1xl w-full text-center absolute"></p>
      <Canvas
        className="h-full w-full absolute bg-black"
        camera={{ position: [0, 0, 5] }}
        //linear={true}
      >
        <CameraControls {...{ pconfig, setPconfig }} />
        {particleSystem !== undefined && (
          <Particles {...{ particleSystem, pconfig }} />
        )}
        {particleSystem !== undefined && <OctaTreeBox {...particleSystem} />}
        {particleSystem !== undefined && (
          <Tracers {...{ particleSystem, pconfig, setDescData }} />
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
      <button
        className="absolute text-xs top-1 right-2 text-zinc-200"
        onClick={() => console.log(particleSystem)}
      >
        l
      </button>
    </div>
  );
};

export default Home;
