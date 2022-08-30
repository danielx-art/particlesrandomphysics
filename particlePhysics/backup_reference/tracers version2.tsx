import * as THREE from "three";
import React, {
  useRef,
  useMemo,
  useState,
  useEffect,
  useLayoutEffect,
} from "react";
import { useFrame } from "@react-three/fiber";
import { CatmullRomLine } from "@react-three/drei";

import {
  parametersType,
  Tparticle,
  TparticleSystem,
} from "../../particlePhysics/types";
import { pickRandomItemsFromArray } from "../../particlePhysics/helpers";
import vec from "../../particlePhysics/vetores";

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
    let randomCount = Math.floor(Math.random() * 60);
    let randomBaseWidth = 0.1;
    let randomWidth =
      randomBaseWidth + (Math.random() > 0.5 ? randomBaseWidth * 2 : 0);
    let configs = Array(randomCount)
      .fill(0)
      .map(() => {
        return {
          particleSystem,
          physics: randomPhysics,
          steps: 150 + Math.ceil(Math.random() * 250),
          detail: 0.5 * (1 + Math.random()),
          width: randomWidth * (1 + Math.random() * 2),
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
  let [positions, positionsArr] = useMemo(
    () => [[] as THREE.Vector3[], [] as [number, number, number][]],
    [physics]
  );

  useFrame(() => {
    let stepsSoFar = positions.length;

    if (stepsSoFar === 0) {
      let randomX = ((Math.random() - 1 / 2) * particleSystem.boundary.w +
        particleSystem.boundary.x) as number;
      let randomY = ((Math.random() - 1 / 2) * particleSystem.boundary.h +
        particleSystem.boundary.y) as number;
      let randomZ = ((Math.random() - 1 / 2) * particleSystem.boundary.d +
        particleSystem.boundary.z) as number;
      positions = [vec(randomX, randomY, randomZ)]; //otherwise just use a random position
    } else if (stepsSoFar > steps) {
      positions.shift();
    }

    let lastPosition = positions[positions.length - 1];

    let totalField = vec();
    particleSystem.particles.forEach((particle) => {
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
    }

    let willRestart = Math.random() < 0.05 ? true : false;

    if (willRestart) {
      let randomX =
        (Math.random() - 1 / 2) * particleSystem.boundary.w +
        particleSystem.boundary.x;
      let randomY =
        (Math.random() - 1 / 2) * particleSystem.boundary.h +
        particleSystem.boundary.y;
      let randomZ =
        (Math.random() - 1 / 2) * particleSystem.boundary.d +
        particleSystem.boundary.z;
      positions = [vec(randomX, randomY, randomZ)];
    }

    positions.forEach((pos) => positionsArr.push([pos.x, pos.y, pos.z]));
  });

  if (line.current) {
    console.log(line.current); //debugg
    //line.current.setPoints(positionsArr);
  }

  return (
    <>
      <CatmullRomLine
        points={[
          [0, 0, 0],
          [1, 0, 0],
          [0, 1, 0],
          [0, 0, 1],
        ]}
        color={color}
        lineWidth={width}
        ref={line}
      />
    </>
  );
}
