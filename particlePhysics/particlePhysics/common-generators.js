import vec from '../particlePhysics/vetores'

//implement a random 3d unit vector for three js
THREE.Vector3.prototype.randomUnitVector = function () {
  this.x = Math.random() * 2 - 1;
  this.y = Math.random() * 2 - 1;
  this.z = Math.random() * 2 - 1;
  this.normalize();
  return this;
};

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

/*
POSITION GENERATIORS
*/

//grid
export function pointsOnA3dGrid([i, total, w, h, d, rows, cols, layers]){
  //i=34 should give x=2, y=0, z=2 if 4x4xany
  let z = Math.floor((i) / (rows*cols));
  let y = Math.floor(((i+1) % (rows*cols))/cols);
  let x = ((i+1) % (rows*cols) -1);
  let zoffset = -d/2;
  let yoffset = -h/2;
  let xoffset = -w/2;
  let spacingx = Math.floor(w/cols);
  let spacingy = Math.floor(h/rows);
  let spacingz = Math.floor(d/layers);
  x = x*spacingx + xoffset;
  y = y*spacingy + yoffset;
  z = z*spacingz + zoffset;
  return vec(x,y,z);
}

export function randomPositions([i,w,h,d]) {
  let x = Math.random()*w - w/2;
  let y = Math.random()*h - h/2;
  let z = Math.random()*d - d/2;
  return vec(x,y,z);
}


//!IMPORTANT - THIS RETURNS AN ARRAY of VERTICES:
export function pointsOnRandomIcosphereSurface([i,total,w,h,d, order]){
  /*
  A complete version of this icosphere generation code can be found at:
  https://github.com/mourner/icomesh/blob/master/index.js
  This version was simplified because we don't need the faces or the uv mapping, just the vertices
  */

  // set up an icosahedron (12 vertices / 20 triangles)
  const f = (1 + Math.sqrt(5)) / 2;
  const T = Math.pow(4, order);

  const numVertices = 10 * T + 2;

  const vertices = new Float32Array((numVertices) * 3);
  vertices.set(Float32Array.of(
      -1, f, 0, 1, f, 0, -1, -f, 0, 1, -f, 0,
      0, -1, f, 0, 1, f, 0, -1, -f, 0, 1, -f,
      f, 0, -1, f, 0, 1, -f, 0, -1, -f, 0, 1
  ));

  let v = 12;
  const midCache = order ? new Map() : null; // midpoint vertices cache to avoid duplicating shared vertices

  function addMidPoint(a, b) {
      const key = Math.floor(((a + b) * (a + b + 1) / 2) + Math.min(a, b)); // Cantor's pairing function
      const i = midCache.get(key);
      if (i !== undefined) {
          midCache.delete(key); // midpoint is only reused once, so we delete it for performance
          return i;
      }
      midCache.set(key, v);
      vertices[3 * v + 0] = (vertices[3 * a + 0] + vertices[3 * b + 0]) * 0.5;
      vertices[3 * v + 1] = (vertices[3 * a + 1] + vertices[3 * b + 1]) * 0.5;
      vertices[3 * v + 2] = (vertices[3 * a + 2] + vertices[3 * b + 2]) * 0.5;
      return v++;
  }

  // normalize vertices
  for (let i = 0; i < numVertices * 3; i += 3) {
      const v1 = vertices[i + 0];
      const v2 = vertices[i + 1];
      const v3 = vertices[i + 2];
      const m  = 1 / Math.sqrt(v1 * v1 + v2 * v2 + v3 * v3);
      vertices[i + 0] *= m;
      vertices[i + 1] *= m;
      vertices[i + 2] *= m;
  }

  return vertices;
}

export function pointsWithinSphere(){

}

export function pointsOn2dGrid(){

}

export function pointsOn2dCircle(){

}

export function pointsOnSpiral(){

}

export function pointsWithin2dCircle(){

}

export function pointsOnRandomSpline(){

}

export function pointsOnRandomSurface(){

}

