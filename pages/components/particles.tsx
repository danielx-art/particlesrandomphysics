import * as THREE from "three";
import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";

import {
  parametersType,
  Tparticle,
  TparticleSystem,
} from "../../particlePhysics/types";

const Particles = (particleSystem: TparticleSystem) => {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const light = useRef<THREE.PointLight>(null);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    if (particleSystem !== undefined) {
      // Run through the randomized data to calculate some movement

      // particleSystem.particles.forEach((particle: Tparticle, index: number) => {
      //   particle.pos.x++;
      // }); //debugg

      particleSystem.update();
      particleSystem.move();

      //particlesystem.collisionDetection.show();
      particleSystem.particles.forEach((particle: Tparticle, index: number) => {
        dummy.position.set(particle.pos.x, particle.pos.y, particle.pos.z);
        dummy.lookAt(particle.dir);
        dummy.updateMatrix();
        // And apply the matrix to the instanced item
        if (mesh.current) mesh.current.setMatrixAt(index, dummy.matrix);
      });
      if (mesh.current) mesh.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <>
      <pointLight ref={light} distance={40} intensity={3} color="lightblue" />
      {particleSystem !== undefined && (
        <instancedMesh ref={mesh} args={[, , particleSystem.num]}>
          <tetrahedronBufferGeometry args={[0.2, 0]} />
          <meshBasicMaterial color="#2596be" />
        </instancedMesh>
      )}
    </>
  );
};

export default Particles;
