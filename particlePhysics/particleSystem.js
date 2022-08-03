import { defaultSystemParameters } from "./typeParameters";
import octaTree from "./octaTree";
import { sphere } from "./shapes";

export default createParticleSystem = function (args = {}) {
  const {
    num,
    boundary,
    posGenerator,
    dirGenerator,
    inertialMass,
    momentInertia,
    movement,
    initialVelocity,
    initialAngularVelocity,
    maxForce,
    maxTorque,
    maxSpeed,
    maxAngVel,
    translationDamping,
    rotationDamping,
    wrap,
    queryRadius,
    safeRadius,
    merge,
    behaviours,
    display,
  } = { ...defaultSystemParameters, ...args };

  //Initialize all the particles
  const self = {
    num,
    boundary,
    movement,
    wrap,
    queryRadius,
    safeRadius,
    particles: [],
  };

  let HANDLE_GENERATOR = function (generator) {
    //make generators only spit arrays
    if (typeof generator === "number") return generator;

    let arrOrValue = generator(args);
    return Array.isArray(arrOrValue)
      ? arrOrValue[args.index] //pre calculated generator[i] wich is a Vector3 or number
      : arrOrValue; //just single calculated Vector3 or number thats possibly different for each i
  };

  let positions = posGenerator(num, boundary);

  for (let i = 0; i < num; i++) {
    let defaultGenArgs = {
      index: i,
      num: num,
      boundary: boundary,
      positions: positions,
    };

    let newParticle = createParticle({
      position: positions[i],
      direction: HANDLE_GENERATOR(dirGenerator, defaultGenArgs),
      inertialMass: HANDLE_GENERATOR(inertialMass, defaultGenArgs),
      momentInertia: HANDLE_GENERATOR(momentInertia, defaultGenArgs),

      movement: HANDLE_GENERATOR(movement, defaultGenArgs),

      initialVelocity: HANDLE_GENERATOR(initialVelocity, defaultGenArgs),
      initialAngularVelocity: HANDLE_GENERATOR(
        initialAngularVelocity,
        defaultGenArgs
      ),

      maxForce: HANDLE_GENERATOR(maxForce, defaultGenArgs),
      maxTorque: HANDLE_GENERATOR(maxTorque, defaultGenArgs),

      maxSpeed: HANDLE_GENERATOR(maxSpeed, defaultGenArgs),
      maxAngVel: HANDLE_GENERATOR(maxAngVel, defaultGenArgs),
      translationDamping: HANDLE_GENERATOR(translationDamping, defaultGenArgs),
      rotationDamping: HANDLE_GENERATOR(rotationDamping, defaultGenArgs),
      behaviours: HANDLE_GENERATOR(behaviours, defaultGenArgs),
      display: HANDLE_GENERATOR(display, defaultGenArgs),
    });

    self.particles.push(newParticle);

    //Collision Detection
    self.collisionDetection = octaTree(boundary, 8);
    self.collisionDetection.insert(newParticle);
  }

  //interactions
  self.update = () => {
    if (movement == "dynamic") {
      for (let i = 0; i < num; i++) {
        let safeRange = sphere(self.particles[i].pos.copy(), safeRadius);
        let forMerge = self.collisionDetection.query(safeRange);
        let indexThis = forMerge.indexOf(self.particles[i]);
        if (indexThis > -1) {
          let range = sphere(self.particles[i].pos, queryRadius);
          let inRange = self.collisionDetection.query(range);
          forMerge.splice(indexThis, 1);
          let agents = inRange.filter((x) => !forMerge.includes(x));
          self.particles[i].applyForces(agents);
        }
      }
    }
  };

  //move
  self.move = () => {
    if (movement == "dynamic") {
      for (let i = 0; i < num; i++) {
        self.particles[i].move();

        /*-------------------------
        ----fake wrapping stuff----
        --------------------------*/
        let bottomWall = self.boundary.y + self.boundary.height / 2;
        let topWall = self.boundary.y - self.boundary.height / 2;
        let rightWall = self.boundary.x + self.boundary.width / 2;
        let leftWall = self.boundary.x - self.boundary.width / 2;

        if (wrap == "torus") {
          if (self.particles[i].pos.x >= rightWall)
            self.particles[i].pos.x = leftWall + 1;
          if (self.particles[i].pos.y >= bottomWall)
            self.particles[i].pos.y = topWall + 1;
          if (self.particles[i].pos.x <= leftWall)
            self.particles[i].pos.x = rightWall - 1;
          if (self.particles[i].pos.y <= topWall)
            self.particles[i].pos.y = bottomWall - 1;
        } else if (wrap == "bounce") {
          if (self.particles[i].pos.x >= rightWall)
            self.particles[i].vel.x *= -1;
          if (self.particles[i].pos.y >= bottomWall)
            self.particles[i].vel.y *= -1;
          if (self.particles[i].pos.x <= leftWall)
            self.particles[i].vel.x *= -1;
          if (self.particles[i].pos.y <= topWall) self.particles[i].vel.y *= -1;
        }

        /*-------------------
        ----Merging stuff----
        --------------------*/

        if (merge == true) {
          let safeRange = sphere(self.particles[i].pos, safeRadius);
          let forMerge = self.collisionDetection.query(safeRange);
          let indexThis = forMerge.indexOf(self.particles[i]);
          if (indexThis > -1) {
            forMerge.splice(indexThis, 1);
          }
          let numMerge = forMerge.length;

          for (let j = 0; j < numMerge; j++) {
            self.particles[i].merge(forMerge[j]); //There is a problem here! Sebugg
            indexToRemove = self.particles.indexOf(forMerge[j]);

            //delete the second particle from particles
            if (indexToRemove > -1) {
              self.particles.splice(indexToRemove, 1);
              num--;
              if (indexToRemove < i) {
                i--;
              }
            }

            //delete the second particle from quadTree

            self.collisionDetection.remove(forMerge[j]);
          }
        }
      }

      self.collisionDetection = octaTree(boundary, 8);
      for (let i = 0; i < self.particles.length; i++) {
        self.collisionDetection.insert(self.particles[i]);
      }
    }
  };

  return self;
};
