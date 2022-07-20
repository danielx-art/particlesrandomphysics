
import * as THREE from 'three';
import React, { useRef, useMemo, Ref } from 'react';
import { useFrame } from '@react-three/fiber';


const Particles = () => {

    //should be passed as props and input by the user
    const count = 300;

    const mesh = useRef<THREE.InstancedMesh>(null);
    const light = useRef<THREE.PointLight>(null);

    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
          const time = Math.random()*100;
          const factor = Math.random()*100 + 20;
          const speed = (Math.random()*0.014 + 0.01)/ 2;
          const x = Math.random()*100 - 50;
          const y = Math.random()*100 - 50;
          const z = Math.random()*100 - 50;
      
          temp.push({ time, factor, speed, x, y, z });
        }
        return temp;
    }, [count]);

    const dummy = useMemo(() => new THREE.Object3D(), []);

    useFrame(() => {
        // Run through the randomized data to calculate some movement
        particles.forEach((particle, index) => {
            let { factor, speed, x, y, z } = particle;

            // Update the particle time
            const t = (particle.time += speed);

            // Update the particle position based on the time
            // This is mostly random trigonometry functions to oscillate around the (x, y, z) point
            dummy.position.set(
                x + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
                y + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
                z + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
            );

            // Derive an oscillating value which will be used
            // for the particle size and rotation
            const s = Math.cos(t);
            dummy.scale.set(s, s, s);
            dummy.rotation.set(s * 5, s * 5, s * 5);
            dummy.updateMatrix();

            // And apply the matrix to the instanced item
            if(mesh.current) mesh.current.setMatrixAt(index, dummy.matrix);
        });
        if(mesh.current) mesh.current.instanceMatrix.needsUpdate = true;
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
}

export default Particles