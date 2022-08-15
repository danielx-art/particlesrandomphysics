import vec from "../vetores";
import { Vector3 } from "three";
import { Iparallelepiped } from "../shapes";

export function pointsOnA3dGrid(
  total: number,
  boundary: Iparallelepiped
): Vector3[] {
  //console.log("pointsOnA3dGrid"); //debugg & test
  let w = boundary.width;
  let h = boundary.height;
  let d = boundary.depth;
  let vertices = [];
  let rows = Math.ceil((0.8 * w) / (Math.random() * 100 + 1));
  let cols = Math.ceil((0.8 * h) / (Math.random() * 50 + 1));
  let layers = Math.ceil(total / (rows * cols));
  let spacingx = Math.floor(w / cols);
  let spacingy = Math.floor(h / rows);
  let spacingz = Math.floor(d / layers);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      for (let k = 0; k < layers; k++) {
        let x = i * spacingx - w / 4;
        let y = j * spacingy - h / 4;
        let z = k * spacingz - d / 4;
        vertices.push(vec(x, y, z));
      }
    }
  }
  return vertices;
}

export function randomPositions(
  total: number,
  boundary: Iparallelepiped
): Vector3[] {
  //console.log("randomPositions"); //debugg & test

  let w = boundary.width;
  let h = boundary.height;
  let d = boundary.depth;
  let vertices = [];
  for (let i = 0; i < total; i++) {
    let x = Math.random() * w - w / 2;
    let y = Math.random() * h - h / 2;
    let z = Math.random() * d - d / 2;
    vertices.push(vec(x, y, z));
  }
  return vertices;
}

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

//   // set up an icosahedron (12 vertices / 20 triangles)
//   const f = (1 + Math.sqrt(5)) / 2;
//   const T = Math.pow(4, order);

//   const numVertices = 10 * T + 2;

//   const vertices = new Float32Array(numVertices * 3);
//   vertices.set(
//     Float32Array.of(
//       -1,
//       f,
//       0,
//       1,
//       f,
//       0,
//       -1,
//       -f,
//       0,
//       1,
//       -f,
//       0,
//       0,
//       -1,
//       f,
//       0,
//       1,
//       f,
//       0,
//       -1,
//       -f,
//       0,
//       1,
//       -f,
//       f,
//       0,
//       -1,
//       f,
//       0,
//       1,
//       -f,
//       0,
//       -1,
//       -f,
//       0,
//       1
//     )
//   );

//   // normalize vertices and convert to a Vector3[]
//   let vec3vertices = [];
//   for (let i = 0; i < numVertices * 3; i += 3) {
//     const v1 = vertices[i + 0];
//     const v2 = vertices[i + 1];
//     const v3 = vertices[i + 2];
//     const m = 1 / Math.sqrt(v1 * v1 + v2 * v2 + v3 * v3);
//     vertices[i + 0] *= m;
//     vertices[i + 1] *= m;
//     vertices[i + 2] *= m;
//     vec3vertices.push(vec(vertices[i], vertices[i + 1], vertices[i + 2]));
//   }

//   //scale randomly based on maximum dimension
//   let randomScale =
//     (Math.random() * Math.max(w, h, d)) / 3 + Math.min(w, h, d) / 3;
//   vec3vertices.forEach((item) => item.multiplyScalar(randomScale));

//   //theres a problem when total < vertices.lenght or vice-versa
//   return vec3vertices;
// }

export function pointsWithinSphere(
  total: number,
  boundary: Iparallelepiped
): Vector3[] {
  //console.log("pointsWithinSphere"); //debugg & test

  let w = boundary.width;
  let h = boundary.height;
  let d = boundary.depth;
  let randomRadius =
    (Math.random() * Math.max(w, h, d)) / 3 + Math.min(w, h, d) / 3;
  let vertices = [];
  for (let i = 0; i < total; i++) {
    vertices.push(vec().randomDirection().setLength(randomRadius));
  }
  return vertices;
}

export function pointsOn2dGrid(
  total: number,
  boundary: Iparallelepiped
): Vector3[] {
  //console.log("pointsOn2dGrid"); //debugg & test

  let w = boundary.width;
  let h = boundary.height;

  let vertices = [];
  let rows = Math.ceil(w / Math.floor(Math.random() * (total / 2) + 1));
  let cols = Math.ceil(total / rows);
  let spcx = w / cols;
  let spcy = h / rows;
  let basis1 = vec().randomDirection().setLength(spcx);
  let basis2 = vec().randomDirection().setLength(spcy);

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let componentx = vec().copy(basis1).multiplyScalar(i);
      let componenty = vec().copy(basis2).multiplyScalar(j);
      vertices.push(componentx.add(componenty));
    }
  }
  return vertices;
}

export function pointsOn2dCircle(
  total: number,
  boundary: Iparallelepiped
): Vector3[] {
  //console.log("pointsOn2dCircle"); //debugg & test

  let w = boundary.width;
  let h = boundary.height;
  let d = boundary.depth;
  let vertices = [];
  let angleSpacing = (2 * Math.PI) / total;
  let randomRadius =
    (Math.random() * Math.max(w, h, d)) / 3 + Math.min(w, h, d) / 3;
  let rotatingAxis = vec().randomDirection();
  for (let i = 0; i < total; i++) {
    let newVertex = vec(1, 0, 0)
      .setLength(randomRadius)
      .applyAxisAngle(rotatingAxis, i * angleSpacing);
    vertices.push(newVertex);
  }
  return vertices;
}

export function pointsOnSpiral(
  total: number,
  boundary: Iparallelepiped
): Vector3[] {
  //console.log("pointsOnSpiral"); //debugg & test

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
    vertices.push(newVertex);
  }
  return vertices;
}

export function pointsWithin2dCircle(
  total: number,
  boundary: Iparallelepiped
): Vector3[] {
  //console.log("pointsWithin2dCircle"); //debugg & test

  let w = boundary.width;
  let h = boundary.height;
  let d = boundary.depth;
  let vertices = [];
  let angleSpacing = (2 * Math.PI) / total;
  let rotatingAxis = vec().randomDirection();
  for (let i = 0; i < total; i++) {
    let randomRadius =
      (Math.random() * Math.max(w, h, d)) / 3 + Math.min(w, h, d) / 3;
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
