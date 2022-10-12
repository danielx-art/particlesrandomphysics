import * as THREE from "three";
import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";

import {
  parametersType,
  Tparticle,
  TparticleSystem,
} from "../../particlePhysics/types";
import vec from "../../particlePhysics/vetores";

const Particles = ({
  particleSystem,
  pconfig,
  pause,
}: {
  particleSystem: TparticleSystem;
  pconfig: parametersType;
  pause: boolean;
}) => {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const light = useRef<THREE.PointLight>(null);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particleGeometry = useMemo(() => pconfig.displayGenerator, [pconfig]);

  useFrame(() => {
    if (pause === true) return;

    if (particleSystem !== undefined) {
      particleSystem.update();
      particleSystem.move();
      particleSystem.particles.forEach((particle: Tparticle, index: number) => {
        dummy.position.set(particle.pos.x, particle.pos.y, particle.pos.z);
        dummy.lookAt(vec().copy(particle.dir).add(particle.pos));
        const size = 0.25;
        dummy.scale.set(1 * size, 1 * size, 2 * size);
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

      {/* {particleSystem !== undefined && (
        <instancedMesh ref={mesh} args={[, , particleSystem.num]}>
          <polyhedronBufferGeometry
            args={[pyramid.vertices, pyramid.indices, 0.8, 0]}
          />
          <meshBasicMaterial
            //vertexColors={true}
            color="#2596be"
            wireframe={Math.random() > 0.5 ? true : false}
          />
        </instancedMesh>
      )} */}

      {particleSystem !== undefined && (
        <instancedMesh ref={mesh} args={[, , particleSystem.num]}>
          <bufferGeometry attach={"geometry"}>
            <bufferAttribute
              attach={"attributes-position"}
              count={particleGeometry.vertices.length / 3}
              array={particleGeometry.vertices}
              itemSize={3}
            />
            <bufferAttribute
              attach={"index"}
              count={particleGeometry.indices.length}
              array={particleGeometry.indices}
              itemSize={1}
            />
            <bufferAttribute
              attach={"attributes-color"}
              count={particleGeometry.colors.length / 3}
              array={particleGeometry.colors}
              itemSize={3}
            />
          </bufferGeometry>
          <meshBasicMaterial
            attach="material"
            color="#2596be"
            vertexColors={true}
          />
        </instancedMesh>
      )}
    </>
  );
};

export default Particles;
