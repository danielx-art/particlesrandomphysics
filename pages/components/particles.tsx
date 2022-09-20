import * as THREE from "three";
import React, { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";

import { Tparticle, TparticleSystem } from "../../particlePhysics/types";
import vec from "../../particlePhysics/vetores";

const Particles = (particleSystem: TparticleSystem) => {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const light = useRef<THREE.PointLight>(null);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  const pyramid = useMemo(() => {
    return {
      vertices: [1, 0, 0, 0, 1, 0, -1, 0, 0, 0, -1, 0, 0, 0, 1],
      indices: [0, 1, 2, 2, 3, 0, 0, 4, 1, 1, 4, 2, 2, 4, 3, 3, 4, 0],
    };
  }, []);

  useFrame(() => {
    if (particleSystem !== undefined) {
      particleSystem.update();
      particleSystem.move();
      particleSystem.particles.forEach((particle: Tparticle, index: number) => {
        dummy.position.set(particle.pos.x, particle.pos.y, particle.pos.z);
        dummy.lookAt(vec().copy(particle.dir).add(particle.pos));

        dummy.scale.set(1, 1, 2);
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
          <polyhedronBufferGeometry
            args={[pyramid.vertices, pyramid.indices, 0.15, 0]}
          />
          <meshBasicMaterial
            color="#2596be"
            wireframe={Math.random() > 0.5 ? true : false}
          />
        </instancedMesh>
      )}
    </>
  );
};

export default Particles;
