import * as THREE from "three";
import React, { useRef, useMemo } from "react";
import { useFrame, extend } from "@react-three/fiber";

import { parametersType, TparticleSystem } from "../../particlePhysics/types";
import { pickRandomItemsFromArray } from "../../particlePhysics/helpers";
import trace from "../../particlePhysics/tracers";
import { MeshLine } from "../../MeshLine/meshLine";
import { MeshLineMaterial } from "../../MeshLine/material";

extend({ MeshLine, MeshLineMaterial });

type Ttracersprops = {
  particleSystem: TparticleSystem;
  pconfig: parametersType;
  setDescData: React.Dispatch<
    React.SetStateAction<{
      [key: string]: any;
    }>
  >;
  pause: boolean;
};

export default function Tracers({
  particleSystem,
  pconfig,
  setDescData,
  pause,
}: Ttracersprops) {
  const randomConfigs = useMemo(() => {
    let fieldTraceableSystemBehaviours = particleSystem.physics
      .filter(
        (physicsMetadata: { fieldTraceable: boolean }) =>
          physicsMetadata.fieldTraceable === true
      )
      .map(
        (physicsMetadata: { title: { en: string } }) => physicsMetadata.title.en
      );

    let randomPhysics = Array.isArray(fieldTraceableSystemBehaviours)
      ? (pickRandomItemsFromArray(fieldTraceableSystemBehaviours, 1) as string)
      : "none";

    setDescData((state) => {
      return {
        ...state,
        tracingField: randomPhysics,
      };
    });

    let randomCount =
      Math.random() > 0.5 ? 20 + Math.floor(Math.random() * 20) : 20;
    let randomBaseWidth = Math.random() > 0.5 ? 0.05 : 0.02;
    let configs = Array(randomCount)
      .fill(0)
      .map(() => {
        let randomNumber = Math.random();

        let randomWidth =
          Math.random() > 0.5 ? randomBaseWidth - 0.01 : randomBaseWidth + 0.01;

        return {
          pause,
          particleSystem,
          physics: randomPhysics,
          steps: 20 + Math.ceil(randomNumber * 80),
          detail: 0.1 * (1 + randomNumber / 4),
          width: randomWidth,

          color: "hotpink", //pick from a list ?
        };
      });
    return configs;
  }, [pconfig, pause]);

  return (
    <>
      {randomConfigs !== undefined &&
        randomConfigs.map((props, index) => (
          <SingleFieldTrace key={index} {...props} />
        ))}
    </>
  );
}

export function SingleFieldTrace({
  pause,
  particleSystem,
  physics,
  steps,
  detail,
  width,
  color,
}: {
  pause: boolean;
  particleSystem: TparticleSystem;
  physics: string;
  steps: number;
  detail: number;
  width: number;
  color: string;
}) {
  const line = useRef() as any;

  let positions = useMemo(() => {
    let positions = trace(particleSystem, physics, steps, detail, []);
    return positions;
  }, [physics]);

  useFrame(() => {
    if (pause === true) {
      return;
    }

    //check if last two positions are equal
    if (positions.length > 2) {
      let lastPosition = positions[positions.length - 1];
      let secondLastPosition = positions[positions.length - 2];
      if (
        lastPosition.x == secondLastPosition.x &&
        lastPosition.y == secondLastPosition.y &&
        lastPosition.z == secondLastPosition.z
      ) {
        positions = trace(particleSystem, physics, steps, detail, []);
        if (line.current) {
          line.current.geometry.dispose();
          line.current.setPoints(positions);
        }
      }
    }

    if (line.current) {
      let lastPosition = positions[positions.length - 1] as THREE.Vector3;

      let nextPosition = trace(particleSystem, physics, 2, detail, [
        lastPosition,
      ]).pop() as THREE.Vector3;

      positions.shift();
      positions.push(nextPosition);

      line.current.advance(nextPosition);
    }
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
