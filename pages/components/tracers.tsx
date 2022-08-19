import * as THREE from "three";
import React, {
  useRef,
  useMemo,
  useState,
  useEffect,
  useLayoutEffect,
} from "react";
import { useFrame, extend, Object3DNode } from "@react-three/fiber";

import { Tparticle, TparticleSystem } from "../../particlePhysics/types";
import trace from "../../particlePhysics/trace";
import { pickRandomItemsFromArray } from "../../particlePhysics/helpers";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry";
import { Line2 } from "three/examples/jsm/lines/Line2";

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
  steps: number;
  detail: number;
  width: number;
  color: string;
  count: number;
};

export default function Tracers({
  particleSystem,
  steps,
  detail,
  width,
  color,
  count,
}: Ttracersprops) {
  const tracesConfig = useMemo(() => {
    return new Array(count).fill(0).map((item) => {
      return {
        particleSystem,
        steps,
        detail,
        width,
        color,
      };
    });
  }, [particleSystem, steps, detail, width, color, count]);

  return (
    <>
      {tracesConfig.map((props, index) => (
        <SingleTrace key={index} {...props} />
      ))}
    </>
  );
}

export function SingleTrace({
  particleSystem,
  steps,
  detail,
  width,
  color,
}: any) {
  const line = useRef() as any;

  //const [positions, setPositions] = useState([] as Vector3[]);
  let positions = [] as THREE.Vector3[];

  useFrame(() => {
    let randomPhysics = pickRandomItemsFromArray(
      particleSystem.physics,
      1
    ) as any;
    let newPositions = trace(
      particleSystem,
      randomPhysics.title,
      steps,
      detail,
      positions
    );
    positions = newPositions;
    if (line.current) {
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
