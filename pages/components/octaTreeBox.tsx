import * as THREE from "three";
import { Box } from "@react-three/drei";
import { useMemo } from "react";
import { TparticleSystem } from "../../particlePhysics/types";

const OctaTreeBox = (particleSystem: TparticleSystem) => {
  let tree = particleSystem.collisionDetection;

  const geom = useMemo(
    () =>
      new THREE.BoxBufferGeometry(
        tree.boundary.w,
        tree.boundary.h,
        tree.boundary.d
      ),
    [particleSystem]
  );
  return (
    <lineSegments>
      <edgesGeometry attach="geometry" args={[geom]} />
      <lineBasicMaterial color="gray" attach="material" />
    </lineSegments>
  );
};

export default OctaTreeBox;
