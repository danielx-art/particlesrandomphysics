import * as THREE from "three";
import React, { useRef, useMemo, Ref } from "react";
import { useFrame } from "@react-three/fiber";

const Particles = () => {
  //should be passed as props and input by the user
  const count = 300;

  const mesh = useRef<THREE.InstancedMesh>(null);
  const light = useRef<THREE.PointLight>(null);

  const particlesystem = useMemo(() => {
    const psystem = createParticleSystem({
      num: number,
      boundary: rectangle(width / 2, height / 2, 0.6 * width, 0.6 * height),
      posGenerator: putIndexOnASpacedGrid(
        1,
        3,
        0.2 * width,
        0.2 * height,
        width / 2 - 0.2 * width,
        height / 2
      ),
      movement: "dynamic",
      initialVelocity: (i) => {
        return vec().random2D(maxSpeed);
        //return vec();
      },
      maxForce,
      maxSpeed,
      queryRadius: 400,
      safeRadius: 20, //bug
      merge,
      behaviours: (i) => {
        return [
          {
            type: "gravity",
            G: 90,
          },
          // ,
        ];
      },
    });

    return psystem;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    // Run through the randomized data to calculate some movement

    //particlesystem.update();
    //particlesystem.move();
    //particlesystem.collisionDetection.show();

    particles.forEach((particle, index) => {
      //do all the update system here OR update the system and then update and register the dummies
      let { factor, speed, x, y, z } = particle;

      // Update the particle time
      const t = (particle.time += speed);

      // Update the particle position based on the time
      //dummy.position.set();

      //dummy.lookAt();
      dummy.updateMatrix();

      // And apply the matrix to the instanced item
      if (mesh.current) mesh.current.setMatrixAt(index, dummy.matrix);
    });
    if (mesh.current) mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <pointLight ref={light} distance={40} intensity={3} color="lightblue" />
      <instancedMesh ref={mesh} args={[, , count]}>
        <tetrahedronBufferGeometry args={[0.2, 0]} />
        <meshPhongMaterial color="#2596be" />
      </instancedMesh>
    </>
  );
};

export default Particles;
