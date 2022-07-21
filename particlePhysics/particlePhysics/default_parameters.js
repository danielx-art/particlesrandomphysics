import * as THREE from "three";

//implement a random 3d vector for three js
THREE.Vector3.prototype.randomUnitVector = function () {
  this.x = Math.random() * 2 - 1;
  this.y = Math.random() * 2 - 1;
  this.z = Math.random() * 2 - 1;
  this.normalize();
  return this;
};

export default defaultSystemParameters = {
  num: 3,

  boundary: rectangle(0, 0, 720, 720), //should take a look at the size of the viweport in the coords of three js canvas

  posGenerator: (i) => {
    return new THREE.Vector3(
      Math.random() * (boundary.width - 200) + 100,
      Math.random() * (boundary.height - 200) + 100,
      Math.random() * (boundary.depth - 200) + 100
    );
  },

  dirGenerator: (i) => {
    return new THREE.Vector3.randomUnitVector();
  },

  inertialMass: (i) => {
    return 1;
  },
  momentInertia: (i) => {
    return 1000;
  },

  movement: "dynamic",

  initialVelocity: (i) => {
    return new THREE.Vector3.randomUnitVector();
  },
  initialAngularVelocity: (i) => {
    return new THREE.Vector3.randomUnitVector();
  },
  maxForce: (i) => {
    return 10;
  },
  maxTorque: (i) => {
    return 0.5;
  },
  maxSpeed: (i) => {
    return 0.1;
  },
  maxAngVel: (i) => {
    return 0.1;
  },
  translationDamping: (i) => {
    return 1;
  },
  rotationDamping: (i) => {
    return 1;
  },

  wrap: "bounce",

  queryRadius: 500,

  safeRadius: 5,

  merge: false,

  behaviours: (i) => {
    return [
      {
        type: "externalForce",
        intensity: 10,
        field: () => {
          return vec(0, 1);
        }, //just a constant vertical gravity
      },
    ];
  },

  display: null,
};
