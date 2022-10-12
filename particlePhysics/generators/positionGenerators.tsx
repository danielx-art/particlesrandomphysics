import vec from "../vetores";
import { Vector3 } from "three";
import { Iparallelepiped } from "../shapes";

// export function pointsOnRandomIcosphereSurface(
//   total: number,
//   boundary: Iparallelepiped
// ): Vector3[] {
//   let w = boundary.width;
//   let h = boundary.height;
//   let d = boundary.depth;
//   /*
//   A complete version of this icosphere generation code can be found at:
//   https://github.com/mourner/icomesh/blob/master/index.js
//   This version was simplified because we don't need the faces or the uv mapping, just the vertices.
//   the order represents the number of subdivisions and should be between 4 and 10
//   */

//   let order = Math.floor(Math.random() * 6 + 4);

//   // set up an icosahedron (12 vertices / 20 triangles) - HAVE TO SUBDIVE IN CASE total>12
//   const f = (1 + Math.sqrt(5)) / 2;
//   const T = Math.pow(4, order);

//   const numVertices = 10 * T + 2;

//   const vertices = new Float32Array(numVertices * 3);

//   //prettier-ignore
//   vertices.set(
//     Float32Array.of(
//       -1, f, 0, 1, f, 0, -1, -f, 0, 1, -f, 0, 0, -1, f, 0, 1, f, 0, -1, -f, 0, 1, -f, f, 0, -1, f, 0, 1, -f, 0, -1, -f, 0, 1
//     )
//   );

//   // normalize vertices and convert to a Vector3[]
//   let vec3vertices = [];
//   let randomRadius = ((Math.random() + 1) * 0.8 * Math.min(w, h, d)) / 4;
//   for (let i = 0; i < numVertices * 3; i += 3) {
//     const v1 = vertices[i + 0];
//     const v2 = vertices[i + 1];
//     const v3 = vertices[i + 2];

//     i / 3 > total
//       ? null
//       : vec3vertices.push(
//           vec(vertices[i], vertices[i + 1], vertices[i + 2]).setLength(
//             randomRadius
//           )
//         );
//   }

//   return vec3vertices;
// }

export function pointsOnA3dGrid(
  total: number,
  boundary: Iparallelepiped
): Vector3[] {
  //console.log("pointsOnA3dGrid"); // test
  let w = boundary.width;
  let h = boundary.height;
  let d = boundary.depth;
  let n = Math.round(Math.cbrt(total));
  let vertices = [];
  let rows = n;
  let cols = n;
  let layers = Math.ceil(total / (n * n));
  let spacingx = Math.round((0.8 * w) / cols);
  let spacingy = Math.round((0.8 * h) / rows);
  let spacingz = Math.round((0.8 * d) / layers);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      for (let k = 0; k < layers; k++) {
        let x = i * spacingx;
        let y = j * spacingy;
        let z = k * spacingz;
        vertices.push(vec(x, y, z).sub(vec(w / 4, h / 4, d / 4)));
      }
    }
  }
  return vertices;
}

export function randomPositions(
  total: number,
  boundary: Iparallelepiped
): Vector3[] {
  //console.log("randomPositions"); //test
  let w = boundary.width;
  let h = boundary.height;
  let d = boundary.depth;
  let vertices = [];
  for (let i = 0; i < total; i++) {
    let x = 0.8 * (Math.random() * w - w / 2) + boundary.x;
    let y = 0.8 * (Math.random() * h - h / 2) + boundary.y;
    let z = 0.8 * (Math.random() * d - d / 2) + boundary.z;
    vertices.push(vec(x, y, z));
  }

  return vertices;
}

export function pointsWithinSphere(
  total: number,
  boundary: Iparallelepiped
): Vector3[] {
  //console.log("pointsWithinSphere"); // test

  let w = boundary.width;
  let h = boundary.height;
  let d = boundary.depth;
  let randomRadius = ((Math.random() + 1) * 0.8 * Math.min(w, h, d)) / 4;
  let vertices = [];
  for (let i = 0; i < total; i++) {
    vertices.push(
      vec()
        .randomDirection()
        .setLength(randomRadius)
        .add(vec().copy(boundary.center))
    );
  }
  return vertices;
}

export function pointsOn2dGrid(
  total: number,
  boundary: Iparallelepiped
): Vector3[] {
  //console.log("pointsOn2dGrid"); // test

  let w = boundary.width;
  let h = boundary.height;
  let d = boundary.depth;
  let n = Math.round(Math.sqrt(total));

  let vertices = [];
  let rows = n;
  let cols = Math.ceil(total / n);
  let spcx = (0.8 * 0.5 * Math.min(w, h, d)) / cols;
  let spcy = (0.8 * 0.5 * Math.min(w, h, d)) / rows;
  let randomDir = vec().randomDirection();
  let basis1 = vec().copy(randomDir).setLength(spcx);
  let basis2 = vec(-randomDir.y, randomDir.x, randomDir.z).setLength(spcy);

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let componentx = vec()
        .copy(basis1)
        .multiplyScalar(i - rows / 2);
      let componenty = vec()
        .copy(basis2)
        .multiplyScalar(j - cols / 2);
      vertices.push(componentx.add(componenty));
    }
  }
  return vertices;
}

export function pointsOn2dCircle(
  total: number,
  boundary: Iparallelepiped
): Vector3[] {
  //console.log("pointsOn2dCircle"); //test

  let w = boundary.width;
  let h = boundary.height;
  let d = boundary.depth;
  let vertices = [];
  let angleSpacing = (2 * Math.PI) / total;
  let randomRadius = ((Math.random() + 1) * 0.8 * Math.min(w, h, d)) / 4;
  let rotatingAxis = vec().randomDirection();
  for (let i = 0; i < total; i++) {
    let newVertex = vec(1, 0, 0)
      .setLength(randomRadius)
      .applyAxisAngle(rotatingAxis, i * angleSpacing);
    vertices.push(newVertex.add(vec().copy(boundary.center)));
  }
  return vertices;
}

export function pointsOnSpiral(
  total: number,
  boundary: Iparallelepiped
): Vector3[] {
  //console.log("pointsOnSpiral"); // test

  let w = boundary.width;
  let h = boundary.height;
  let d = boundary.depth;
  let vertices = [];
  let angleSpacing = (2 * Math.PI) / total;
  let randomRadius =
    (Math.random() * Math.max(w, h, d)) / 3 + Math.min(w, h, d) / 3;
  let radiusIncrease = randomRadius / total;
  let rotatingAxis = vec().randomDirection();
  for (let i = 0; i < total; i++) {
    let newVertex = vec(1, 0, 0)
      .setLength(i * radiusIncrease)
      .applyAxisAngle(rotatingAxis, i * angleSpacing);
    vertices.push(newVertex.add(vec().copy(boundary.center)));
  }
  return vertices;
}

export function pointsWithin2dCircle(
  total: number,
  boundary: Iparallelepiped
): Vector3[] {
  //console.log("pointsWithin2dCircle"); //test

  let w = boundary.width;
  let h = boundary.height;
  let d = boundary.depth;
  let vertices = [];
  let angleSpacing = (2 * Math.PI) / total;
  let rotatingAxis = vec().randomDirection();
  for (let i = 0; i < total; i++) {
    let randomRadius = ((Math.random() + 1) * 0.8 * Math.min(w, h, d)) / 4;
    let newVertex = vec(1, 0, 0)
      .setLength(randomRadius)
      .applyAxisAngle(rotatingAxis, i * angleSpacing * Math.random());
    vertices.push(newVertex);
  }
  return vertices;
}

// export function pointsOnRandomSpline(total, w, h, d){
//   let [w, h, d] = [boundary.w, boundary.h, boundary.d];
// }

// export function pointsOnRandomSurface(total, w, h, d){
//   let [w, h, d] = [boundary.w, boundary.h, boundary.d];
// }
