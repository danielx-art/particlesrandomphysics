import * as THREE from "three";
import React, {
  useRef,
  useMemo,
  useState,
  useEffect,
  useLayoutEffect,
} from "react";
import { useFrame, extend, Object3DNode } from "@react-three/fiber";

import {
  parametersType,
  Tparticle,
  TparticleSystem,
} from "../../particlePhysics/types";
import trace from "../../particlePhysics/trace";
import { pickRandomItemsFromArray } from "../../particlePhysics/helpers";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry";
import { Line2 } from "three/examples/jsm/lines/Line2";
import vec from "../../particlePhysics/vetores";

extend({ LineMaterial, LineGeometry, Line2 });

declare module "@react-three/fiber" {
  interface ThreeElements {
    line2: Object3DNode<Line2, typeof Line2>;
    lineMaterial: Object3DNode<LineMaterial, typeof LineMaterial>;
    lineGeometry: Object3DNode<LineGeometry, typeof LineGeometry>;
  }
}

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
    let configs = Array(randomCount)
      .fill(0)
      .map(() => {
        return {
          particleSystem,
          physics: randomPhysics,
          steps: 150 + Math.ceil(Math.random() * 250),
          detail: 0.5 * (1 + Math.random()),
          width: 0.001 * (1 + Math.random() * 10),
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
  let positions = useMemo(() => [] as THREE.Vector3[], [physics]);
  useFrame(() => {
    let stepsSoFar = positions.length;
    //let stepsToGo = steps - stepsSoFar;

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

    if (line.current && positions.length > 1) {
      let curve = new THREE.CatmullRomCurve3(positions).getPoints(steps);
      let convertedToArray = [] as number[];
      curve.forEach((item) => convertedToArray.push(item.x, item.y, item.z));
      line.current.setPositions(convertedToArray);
    }
  });

  return (
    <>
      <line2>
        <lineGeometry ref={line} />
        <lineMaterial
          color={color}
          linewidth={width}
          resolution={new THREE.Vector2(10, 10)}
        />
      </line2>
    </>
  );
}

// export function SingleTrace({
//   particleSystem,
//   steps,
//   detail,
//   width,
//   color,
// }: any) {
//   const line = useRef() as any;

//   //const [positions, setPositions] = useState([] as Vector3[]);
//   let positions = [] as THREE.Vector3[];

//   useFrame(() => {
//     let randomPhysics = pickRandomItemsFromArray(
//       particleSystem.physics,
//       1
//     ) as any;
//     let newPositions = trace(
//       particleSystem,
//       randomPhysics.title,
//       steps,
//       detail,
//       positions
//     );
//     positions = newPositions;
//     if (line.current) {
//       line.current.geometry.setFromPoints(positions);
//     }
//   });

//   return (
//     <>
//       <line ref={line}>
//         <bufferGeometry />
//         <lineBasicMaterial color={color} linewidth={width} />
//       </line>
//     </>
//   );
// }
