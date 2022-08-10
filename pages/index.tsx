import { Canvas, useThree } from "@react-three/fiber";
import type { NextPage } from "next";
import Particles from "./components/particles";
import Buttons from "./components/buttons";
import { usePconfig } from "../context/context";
import { OrbitControls } from "@react-three/drei";

const Home: NextPage = () => {
  const { pconfig, setPconfig } = usePconfig();

  return (
    <>
      <p className="text-1xl w-full text-center absolute"></p>
      <Canvas
        className="h-full w-full absolute"
        camera={{ position: [0, 0, -5] }}
      >
        <CameraControls />
        <Particles {...{ pconfig, setPconfig }} />
      </Canvas>
      <Buttons />
    </>
  );
};

export default Home;

const CameraControls = () => {
  const {
    camera,
    gl: { domElement },
  } = useThree();

  return <OrbitControls args={[camera, domElement]} enableZoom={false} />;
};
