import * as THREE from "three";
import React, { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import createParticleSystem from '../particlePhysics/particlePhysics/particleSystem'
import { usePconfig } from "../context/context";


const Particles = () => {

  const viewport = useThree((state) => state.viewport);
  const {pconfig, setPconfig} = usePconfig();

  if(viewport.width){
    //set the boundary in pconfig
  }

  if(pconfig) {
    //create the particle system using the context parameters
  }
  
  //should be passed as props and input by the user
  const number = 300;

  const mesh = useRef<THREE.InstancedMesh>(null);
  const light = useRef<THREE.PointLight>(null);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    // Run through the randomized data to calculate some movement

    particlesystem.update();
    particlesystem.move();
    //particlesystem.collisionDetection.show();

    particlesystem.particles.forEach((particle, index) => {
      dummy.position.set(particle.pos.x, particle.pos.y, particle.pos.z);

      dummy.lookAt(particle.dir);
      dummy.updateMatrix();

      // And apply the matrix to the instanced item
      if (mesh.current) mesh.current.setMatrixAt(index, dummy.matrix);
    });
    if (mesh.current) mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <pointLight ref={light} distance={40} intensity={3} color="lightblue" />
      <instancedMesh ref={mesh} args={[, , number]}>
        <tetrahedronBufferGeometry args={[0.2, 0]} />
        <meshPhongMaterial color="#2596be" />
      </instancedMesh>
    </>
  );
};

export default Particles;
