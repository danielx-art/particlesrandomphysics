import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { pickRandomConfig } from "../../particlePhysics/randomConfig";
import { parametersType } from "../../particlePhysics/types";
import { parallelepiped } from "../../particlePhysics/shapes";
import vec from "../../particlePhysics/vetores";

type Tprops = {
  pconfig: parametersType;
  setPconfig: React.Dispatch<React.SetStateAction<parametersType>>;
};

const CameraControls = ({ pconfig, setPconfig }: Tprops) => {
  const {
    camera,
    gl: { domElement },
  } = useThree();

  /*setup for the viewport dimensions and particle system boundary */
  const viewport = useThree((state) => state.viewport);

  useEffect(() => {
    //this will create the first boundary
    if (pconfig.num === 0) {
      let viewportFirstBoundary = parallelepiped(
        vec(0, 0, 0),
        2 * Math.max(viewport.width, viewport.height),
        2 * Math.max(viewport.width, viewport.height),
        2 * Math.max(viewport.width, viewport.height)
      );
      let firstConfig = pickRandomConfig(viewportFirstBoundary);
      setPconfig(firstConfig);
    }
  }, [pconfig.num]);

  return <OrbitControls args={[camera, domElement]} enableZoom={false} />;
};

export default CameraControls;
