import vec from "../vetores";
import { Vector3 } from "three";
import { Iparallelepiped } from "../shapes";

/*
design a bunch of simple generators to pick from a random list.
remembering, this is the parameters of the particle system:
  posGenerator: vectorGeneratorType ,
  dirGenerator: vectorGeneratorType
  inertialMass: scalarGeneratorType,
  momentInertia: scalarGeneratorType,
  initialVelocity: vectorGeneratorType,
  initialAngularVelocity: vectorGeneratorType,
  maxForce: scalarGeneratorType,
  maxTorque: scalarGeneratorType,
  maxSpeed: scalarGeneratorType,
  maxAngVel: scalarGeneratorType,
  translationDamping: scalarGeneratorType,
  rotationDamping: scalarGeneratorType,
  display: null (maybe a scale?)
*/

export function pointsOnA3dGrid(
  total: number,
  boundary: Iparallelepiped
): Vector3[] {
  let w = boundary.width;
  let h = boundary.height;
  let d = boundary.depth;
  let vertices = [];
  let rows = Math.floor(w / (Math.random() * 100));
  let cols = Math.floor(h / (Math.random() * 50));
  let layers = Math.ceil(total / (rows * cols));
  let spacingx = Math.floor(w / cols);
  let spacingy = Math.floor(h / rows);
  let spacingz = Math.floor(d / layers);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      for (let k = 0; k < layers; k++) {
        let x = i * spacingx - w / 2;
        let y = j * spacingy - h / 2;
        let z = k * spacingz - d / 2;
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

export function pointsOnRandomIcosphereSurface(
  total: number,
  boundary: Iparallelepiped
): Vector3[] {
  let w = boundary.width;
  let h = boundary.height;
  let d = boundary.depth;
  /*
  A complete version of this icosphere generation code can be found at:
  https://github.com/mourner/icomesh/blob/master/index.js
  This version was simplified because we don't need the faces or the uv mapping, just the vertices.
  the order represents the number of subdivisions and should be between 4 and 10
  */

  let order = Math.floor(Math.random() * 6 + 4);

  // set up an icosahedron (12 vertices / 20 triangles)
  const f = (1 + Math.sqrt(5)) / 2;
  const T = Math.pow(4, order);

  const numVertices = 10 * T + 2;

  const vertices = new Float32Array(numVertices * 3);
  vertices.set(
    Float32Array.of(
      -1,
      f,
      0,
      1,
      f,
      0,
      -1,
      -f,
      0,
      1,
      -f,
      0,
      0,
      -1,
      f,
      0,
      1,
      f,
      0,
      -1,
      -f,
      0,
      1,
      -f,
      f,
      0,
      -1,
      f,
      0,
      1,
      -f,
      0,
      -1,
      -f,
      0,
      1
    )
  );

  // normalize vertices and convert to a Vector3[]
  let vec3vertices = [];
  for (let i = 0; i < numVertices * 3; i += 3) {
    const v1 = vertices[i + 0];
    const v2 = vertices[i + 1];
    const v3 = vertices[i + 2];
    const m = 1 / Math.sqrt(v1 * v1 + v2 * v2 + v3 * v3);
    vertices[i + 0] *= m;
    vertices[i + 1] *= m;
    vertices[i + 2] *= m;
    vec3vertices.push(vec(vertices[i], vertices[i + 1], vertices[i + 2]));
  }

  //scale randomly based on maximum dimension
  let randomScale =
    (Math.random() * Math.max(w, h, d)) / 3 + Math.min(w, h, d) / 3;
  vec3vertices.forEach((item) => item.multiplyScalar(randomScale));

  //theres a problem when total < vertices.lenght or vice-versa
  return vec3vertices;
}

export function pointsWithinSphere(
  total: number,
  boundary: Iparallelepiped
): Vector3[] {
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
  let w = boundary.width;
  let h = boundary.height;

  let vertices = [];
  let rows = Math.floor((w / Math.random()) * (total / 2));
  let cols = Math.round(total / rows);
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
  let w = boundary.width;
  let h = boundary.height;
  let d = boundary.depth;
  let vertices = [];
  let angleSpacing = (2 * Math.PI) / total;
  let randomRadius =
    (Math.random() * Math.max(w, h, d)) / 3 + Math.min(w, h, d) / 3;
  let rotatingAxis = vec().randomDirection();
  for (let i = 0; i < total; i++) {
    let newVertex = vec()
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
    let newVertex = vec()
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
  let w = boundary.width;
  let h = boundary.height;
  let d = boundary.depth;
  let vertices = [];
  let angleSpacing = (2 * Math.PI) / total;
  let rotatingAxis = vec().randomDirection();
  for (let i = 0; i < total; i++) {
    let randomRadius =
      (Math.random() * Math.max(w, h, d)) / 3 + Math.min(w, h, d) / 3;
    let newVertex = vec()
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
