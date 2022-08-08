import { Canvas } from "@react-three/fiber";
import type { NextPage } from "next";
import Particles from "./components/particles";
import Buttons from "./components/buttons";

const Home: NextPage = () => {
  return (
    <>
      <p className="text-1xl w-full text-center absolute"></p>
      <Canvas className="h-full w-full absolute">
        <Particles />
      </Canvas>
      <Buttons />
    </>
  );
};

export default Home;
