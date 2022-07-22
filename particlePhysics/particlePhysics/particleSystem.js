import { defaultSystemParameters } from "./default_parameters";
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

  let FUNC_ARRAY_VALUE = function (obj, ...args) {
    return obj instanceof Function
      ? obj(args)
      : Array.isArray(obj)
      ? obj[args[0]]
      : obj;
  };

  for (let i = 0; i < num; i++) {
    let newParticle = createParticle({
      position: FUNC_ARRAY_VALUE(posGenerator, i, self.boundary),
      direction: FUNC_ARRAY_VALUE(dirGenerator, i ),
      inertialMass: FUNC_ARRAY_VALUE(inertialMass, i),
      momentInertia: FUNC_ARRAY_VALUE(momentInertia, i),

      movement: FUNC_ARRAY_VALUE(movement, i),

      initialVelocity: FUNC_ARRAY_VALUE(initialVelocity, i),
      initialAngularVelocity: FUNC_ARRAY_VALUE(initialAngularVelocity, i),

      maxForce: FUNC_ARRAY_VALUE(maxForce, i),
      maxTorque: FUNC_ARRAY_VALUE(maxTorque, i),

      maxSpeed: FUNC_ARRAY_VALUE(maxSpeed, i),
      maxAngVel: FUNC_ARRAY_VALUE(maxAngVel, i),
      translationDamping: FUNC_ARRAY_VALUE(translationDamping, i),
      rotationDamping: FUNC_ARRAY_VALUE(rotationDamping, i),
      behaviours: FUNC_ARRAY_VALUE(behaviours, i),
      display: FUNC_ARRAY_VALUE(display, i),
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
