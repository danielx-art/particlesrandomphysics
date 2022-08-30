import * as THREE from "three";
import React, {
  useRef,
  useMemo,
  useState,
  useEffect,
  useLayoutEffect,
} from "react";
import { useFrame, extend, Object3DNode } from "@react-three/fiber";
import { CatmullRomLine } from "@react-three/drei";

import {
  parametersType,
  Tparticle,
  TparticleSystem,
} from "../../particlePhysics/types";
import { pickRandomItemsFromArray } from "../../particlePhysics/helpers";
import vec from "../../particlePhysics/vetores";
import { MeshLine } from "../../MeshLine/meshLine";
import { MeshLineMaterial } from "../../MeshLine/material";

extend({ MeshLine, MeshLineMaterial });

type Ttracersprops = {
  particleSystem: TparticleSystem;
  pconfig: parametersType;
};

export default function Tracers({ particleSystem, pconfig }: Ttracersprops) {
  const randomConfigs = useMemo(() => {
    let allSystemBehaviours = particleSystem.physics.map(
      (item: { title: string }) => item.title
    );

    let randomPhysics = pickRandomItemsFromArray(
      allSystemBehaviours,
      1
    ) as string;

    let randomCount =
      Math.random() > 0.5 ? 5 + Math.floor(Math.random() * 5) : 0;
    let randomBaseWidth = 0.008;
    let randomWidth =
      randomBaseWidth + (Math.random() > 0.5 ? randomBaseWidth * 0.1 : 0);
    let configs = Array(randomCount)
      .fill(0)
      .map(() => {
        let randomNumber = Math.random();

        return {
          particleSystem,
          physics: randomPhysics,
          steps: 10 + Math.ceil(randomNumber * 50),
          detail: 0.1 * (1 + randomNumber),
          width: randomWidth * (2 - randomNumber),
          color: "hotpink", //pick from a list later
        };
      });
    return configs;
  }, [pconfig]);

  return (
    <>
      {randomConfigs.map((props, index) => (
        <SingleTrace key={index} {...props} />
      ))}
    </>
  );
}

function createStartingPositions(
  particleSystem: TparticleSystem,
  steps: number,
  physics: string,
  detail: number
) {
  let positions = [] as THREE.Vector3[];
  let randomX = ((Math.random() - 1 / 2) * particleSystem.boundary.w +
    particleSystem.boundary.x) as number;
  let randomY = ((Math.random() - 1 / 2) * particleSystem.boundary.h +
    particleSystem.boundary.y) as number;
  let randomZ = ((Math.random() - 1 / 2) * particleSystem.boundary.d +
    particleSystem.boundary.z) as number;
  positions.push(vec(randomX, randomY, randomZ));

  for (let i = 1; i < steps; i++) {
    let lastPosition = positions[positions.length - 1];

    let totalField = vec();
    particleSystem.particles.forEach((particle) => {
      //console.log(physics);
      //console.log(particle["physics"]); //debugg
      let field = particle["physics"][physics].field(
        lastPosition
      ) as THREE.Vector3;
      totalField.add(field);
    });

    let newPosition = vec()
      .copy(lastPosition)
      .add(vec().copy(totalField).setLength(detail));
    if (particleSystem.boundary.contains(newPosition)) {
      positions.push(newPosition);
    } else {
    }
  }

  return positions;
}

export function SingleTrace({
  particleSystem,
  physics,
  steps,
  detail,
  width,
  color,
}: {
  particleSystem: TparticleSystem;
  physics: string;
  steps: number;
  detail: number;
  width: number;
  color: string;
}) {
  const line = useRef() as any;
  const [toggle, setToggle] = useState(true);

  let [positions, currentPosition] = useMemo(() => {
    let positions = createStartingPositions(
      particleSystem,
      steps,
      physics,
      detail
    );

    let currentPosition = positions.pop() as THREE.Vector3;

    return [positions, currentPosition];
  }, [physics, toggle]);

  useFrame(() => {
    let outOfBoundary = false;
    for (let i = 0; i < 2; i++) {
      if (line.current) {
        let totalField = vec();
        particleSystem.particles.forEach((particle) => {
          let field = particle["physics"][physics].field(
            currentPosition
          ) as THREE.Vector3;
          totalField.add(field);
        });

        let newPosition = vec()
          .copy(currentPosition)
          .add(vec().copy(totalField).setLength(detail));
        if (particleSystem.boundary.contains(newPosition)) {
          currentPosition.copy(newPosition);
          line.current.advance(currentPosition);
        } else {
          outOfBoundary = false;
        }
      }
    }
    if (outOfBoundary === false) setToggle((prev) => !prev);
  });

  return (
    <mesh>
      {/* @ts-ignore */}

      <meshLine ref={line} attach="geometry" points={positions} />

      {/* @ts-ignore */}
      <meshLineMaterial
        attach="material"
        lineWidth={width}
        color={new THREE.Color(color)}
      />
    </mesh>
  );
}
