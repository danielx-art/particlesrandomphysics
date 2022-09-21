type customParticleGeometry = {
  vertices: Float32Array;
  indices: Uint32Array;
  normals?: Float32Array;
  colors?: Float32Array;
};

const simpleSqPyramid: customParticleGeometry = {
  vertices: new Float32Array([1, 0, 0, 0, 1, 0, -1, 0, 0, 0, -1, 0, 0, 0, 1]),
  indices: new Uint32Array([
    0, 2, 1, 3, 2, 0, 0, 1, 4, 1, 2, 4, 2, 3, 4, 3, 0, 4,
  ]),
  normals: new Float32Array([
    0, 0, -1, 0, 0, -1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1,
  ]),
  colors: new Float32Array([
    0.2, 0.3, 0.5, 0, 0.1, 0.4, 0, 0.1, 0.4, 0, 0.1, 0.3, 100, 0, 0,
  ]),
};

const sqPyramid: customParticleGeometry = {
  vertices: new Float32Array([
    0, 0, 0, 1, 0, 0, 0, 1, 0, -1, 0, 0, 0, -1, 0, 0, 0, 1,
  ]),
  indices: new Uint32Array([
    0, 1, 4, 0, 2, 1, 0, 3, 2, 0, 4, 3, 5, 1, 2, 5, 2, 3, 5, 3, 4, 5, 4, 1,
  ]),
  normals: new Float32Array([
    0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1,
    1,
  ]),
  colors: new Float32Array([
    1, 1, 1, 0, 0.2, 0.3, 0, 0.2, 0.3, 0, 0.2, 0.3, 0, 0.2, 0.3, 100, 0, 0,
  ]),
};

export { simpleSqPyramid, sqPyramid };
