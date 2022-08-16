import * as THREE from "three";
import React, { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";

import { Tparticle, TparticleSystem } from "../../particlePhysics/types";

const Particles = (particleSystem: TparticleSystem) => {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const light = useRef<THREE.PointLight>(null);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    if (particleSystem !== undefined) {
      particleSystem.update();
      particleSystem.move();
      particleSystem.particles.forEach((particle: Tparticle, index: number) => {
        dummy.position.set(particle.pos.x, particle.pos.y, particle.pos.z);
        dummy.lookAt(particle.dir);
        dummy.updateMatrix();
        // And apply the matrix to the instanced item
        if (mesh.current) mesh.current.setMatrixAt(index, dummy.matrix);
      });
      if (mesh.current) mesh.current.instanceMatrix.needsUpdate = true;
    }
    //console.log(particleSystem.particles);
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
