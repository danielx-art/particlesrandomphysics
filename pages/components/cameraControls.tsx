import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { parametersType } from "../../particlePhysics/types";

type Tprops = {
  pconfig: parametersType;
  setPconfig: React.Dispatch<React.SetStateAction<parametersType>>;
};

const CameraControls = ({ pconfig, setPconfig }: Tprops) => {
  const {
    camera,
    gl: { domElement },
  } = useThree();

  return <OrbitControls args={[camera, domElement]} enableZoom={true} />;
};

export default CameraControls;
