import * as THREE from "three";
import React, { useRef, useMemo, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import createParticleSystem from "../../particlePhysics/particleSystem";
import { psystConfigType, usePconfig } from "../../context/context";
import * as SHAPES from "../../particlePhysics/shapes";
import vec from "../../particlePhysics/vetores";
import { pickRandomConfig } from "../../particlePhysics/randomConfig";
import { Tparticle } from "../../particlePhysics/types";

const Particles = ({ pconfig, setPconfig }: psystConfigType) => {
  const viewport = useThree((state) => state.viewport);

  useEffect(() => {
    //this will create the first boundary
    if (pconfig.num === 0) {
      const preconfig = pconfig; //use it as a template because im only changing boundary
      preconfig.boundary = SHAPES.parallelepiped(
        vec(0, 0, 0),
        viewport.width,
        viewport.height,
        Math.min(viewport.width, viewport.height)
      );
      let firstConfig = pickRandomConfig(preconfig);
      setPconfig(firstConfig);
    }
  }, [viewport]);

  // const [particleSystem, setParticleSystem] = useState(
  //   createParticleSystem(pconfig)
  // );

  // useEffect(() => {
  //   if (pconfig.num !== 0) {
  //     let psyst = createParticleSystem(pconfig);
  //     console.log(psyst); //debugg
  //     setParticleSystem(psyst);
  //   }
  // }, [pconfig]);

  const particleSystem: any = useMemo(() => {
    /* this will create a new particle system everytime
    pconfig is changed due to button press or it is first set
    with the new boundary dimensions from viewport as set above*/
    if (pconfig.num === 0) {
      return undefined;
    } //due to its not been set yet in buttons
    let psyst = createParticleSystem(pconfig);
    return psyst;
  }, [pconfig]);

  const mesh = useRef<THREE.InstancedMesh>(null);
  const light = useRef<THREE.PointLight>(null);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    if (particleSystem !== undefined) {
      // Run through the randomized data to calculate some movement
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
          <meshPhongMaterial color="#2596be" />
        </instancedMesh>
      )}
    </>
  );
};

export default Particles;
