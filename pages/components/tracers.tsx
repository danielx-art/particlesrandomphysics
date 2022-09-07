import * as THREE from "three";
import React, { useRef, useMemo, useState, useEffect } from "react";
import { useFrame, extend } from "@react-three/fiber";

import { parametersType, TparticleSystem } from "../../particlePhysics/types";
import { pickRandomItemsFromArray } from "../../particlePhysics/helpers";
import vec from "../../particlePhysics/vetores";
import trace from "../../particlePhysics/tracers";
import { MeshLine } from "../../MeshLine/meshLine";
import { MeshLineMaterial } from "../../MeshLine/material";

extend({ MeshLine, MeshLineMaterial });

type Ttracersprops = {
  particleSystem: TparticleSystem;
  pconfig: parametersType;
};

export default function Tracers({ particleSystem, pconfig }: Ttracersprops) {
  const randomConfigs = useMemo(() => {
    let fieldTraceableSystemBehaviours = particleSystem.physics
      .filter(
        (physicsMetadata: { fieldTraceable: boolean }) =>
          physicsMetadata.fieldTraceable === true
      )
      .map((physicsMetadata: { title: string }) => physicsMetadata.title);
    fieldTraceableSystemBehaviours;

    let randomPhysics = pickRandomItemsFromArray(
      fieldTraceableSystemBehaviours,
      1
    ) as string;

    let randomCount =
      Math.random() > 0.5 ? 20 + Math.floor(Math.random() * 20) : 0;
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
          detail: 0.1 * (1 + randomNumber / 4),
          width: randomWidth * (2 - randomNumber),
          color: "hotpink", //pick from a list later
        };
      });
    return configs;
  }, [pconfig]);

  return (
    <>
      {randomConfigs.map((props, index) => (
        <SingleFieldTrace key={index} {...props} />
      ))}
    </>
  );
}

export function SingleFieldTrace({
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

  let positions = useMemo(() => {
    let positions = trace(particleSystem, physics, steps, detail, []);
    return positions;
  }, [physics]);

  useFrame(() => {
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
