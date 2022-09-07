import { Canvas } from "@react-three/fiber";
import type { NextPage } from "next";
import Particles from "./components/particles";
import Buttons from "./components/buttons";
import OctaTreeBox from "./components/octaTreeBox";
import { usePconfig } from "../context/context";
import { useMemo } from "react";
import createParticleSystem from "../particlePhysics/particleSystem";
import { TparticleSystem } from "../particlePhysics/types";
import CameraControls from "./components/cameraControls";
import Tracers, { SingleFieldTrace } from "./components/tracers";

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

  return (
    <>
      <p className="text-1xl w-full text-center absolute"></p>
      <Canvas
        className="h-full w-full absolute bg-black"
        camera={{ position: [0, 0, 5] }}
      >
        <CameraControls {...{ pconfig, setPconfig }} />
        {particleSystem !== undefined && <Particles {...particleSystem} />}
        {particleSystem !== undefined && <OctaTreeBox {...particleSystem} />}
        {particleSystem !== undefined && (
          <Tracers {...{ particleSystem, pconfig }} />
        )}
      </Canvas>
      <Buttons />
    </>
  );
};

export default Home;
