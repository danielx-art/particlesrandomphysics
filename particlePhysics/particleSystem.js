import { defaultSystemParameters } from "./types";
import octaTree from "./octaTree";
import { sphere } from "./shapes";
import { setFluidGetter } from "@react-spring/shared";
import { pickRandomItemsFromArray } from "./helpers";

export default createParticleSystem = function (args = {}) {
  const {
    num,
    boundary,
    posGenerator,
    dirGenerator,
    inertialMassGenerator,
    momentInertiaGenerator,
    movementGenerator,
    initialVelocityGenerator,
    initialAngularVelocityGenerator,
    maxForceGenerator,
    maxTorqueGenerator,
    maxSpeedGenerator,
    maxAngVelGenerator,
    translationDampingGenerator,
    rotationDampingGenerator,
    wrapGenerator,
    queryRadius,
    safeRadius,
    merge,
    behavioursGenerator,
    displayGenerator,
  } = { ...defaultSystemParameters, ...args };

  //Initialize all the particles
  const self = {
    num,
    boundary,
    wrap,
    queryRadius,
    safeRadius,
    merge,
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
      inertialMass: HANDLE_GENERATOR(inertialMassGenerator, defaultGenArgs),
      momentInertia: HANDLE_GENERATOR(momentInertiaGenerator, defaultGenArgs),

      movement: HANDLE_GENERATOR(movementGenerator, defaultGenArgs),

      initialVelocity: HANDLE_GENERATOR(
        initialVelocityGenerator,
        defaultGenArgs
      ),
      initialAngularVelocity: HANDLE_GENERATOR(
        initialAngularVelocityGenerator,
        defaultGenArgs
      ),

      maxForce: HANDLE_GENERATOR(maxForceGenerator, defaultGenArgs),
      maxTorque: HANDLE_GENERATOR(maxTorqueGenerator, defaultGenArgs),

      maxSpeed: HANDLE_GENERATOR(maxSpeedGenerator, defaultGenArgs),
      maxAngVel: HANDLE_GENERATOR(maxAngVelGenerator, defaultGenArgs),
      translationDamping: HANDLE_GENERATOR(
        translationDampingGenerator,
        defaultGenArgs
      ),
      rotationDamping: HANDLE_GENERATOR(
        rotationDampingGenerator,
        defaultGenArgs
      ),
      behaviours: HANDLE_GENERATOR(behavioursGenerator, defaultGenArgs),
      display: HANDLE_GENERATOR(displayGenerator, defaultGenArgs),
    });

    self.particles.push(newParticle);

    //Collision Detection
    self.collisionDetection = octaTree(boundary, 8);
    self.collisionDetection.insert(newParticle);
  }

  //interactions
  self.update = () => {
    for (let i = 0; i < num; i++) {
      let unsafeRange = sphere(self.particles[i].pos.copy(), safeRadius);
      let tooClose = self.collisionDetection.query(unsafeRange);
      let range = sphere(self.particles[i].pos, queryRadius);
      let inRange = self.collisionDetection.query(range);
      let agents = inRange.filter((x) => !tooClose.includes(x));
      self.particles[i].applyForces(agents);
    }
  };

  let repopulateTree = () => {
    self.collisionDetection = octaTree(boundary, 8);
    for (let i = 0; i < self.particles.length; i++) {
      self.collisionDetection.insert(self.particles[i]);
    }
  };

  //move
  self.move = () => {
    for (let i = 0; i < num; i++) {
      self.particles[i].move();
      self.wrap(particles[i], boundary);
      repopulateTree();

      /*note: 
      everytime I change particle position on this loop I should repopulate the tree so the next particle
      can query other particles correctly. But can't I build an event listener so that the tree automatically tracks
      self.particles positions?
      */

      if (merge == true) {
        let closeRange = sphere(self.particles[i].pos, safeRadius);
        let forMerge = self.collisionDetection.query(closeRange);
        let indexThis = forMerge.indexOf(self.particles[i]);
        if (indexThis > -1) {
          forMerge.splice(indexThis, 1);
        }
        let numMerge = forMerge.length;

        for (let j = 0; j < numMerge; j++) {
          self.particles[i].merge(forMerge[j]); //this changes position of the particle, but since I already did the wrapping, then it should not be a concern that the particle will be out of the tree boundary
          //repopulateTree(); //overkill - only makes a difference if merge radius is very big wich should not be the case

          //then I have to remove the particle wich has been merged with this one from both the tree and particles array
          indexToRemove = self.particles.indexOf(forMerge[j]);

          /*interesting note:
          Since I'm looping trough the particles in a crescent index "i", then
          if particle "i" wants to merge with particle "indexToRemove", then I didnt 
          yet went through particle "indexToRemove", because if so particle "i" would 
          be already merged, so "i" will always be less then "indexToRemove". 
          */

          //delete the second particle from tree
          self.collisionDetection.remove(particles[indexToRemove]);

          //delete the second particle from self.particles
          if (indexToRemove > -1) {
            self.particles.splice(indexToRemove, 1);
            num--; //so that we dont get array out of bounds
          }
        }
      }
      repopulateTree();
    } //particle loop

    //after going trought all the particles, I should recreate the tree again, or should I?
    repopulateTree();
  };

  return self;
};
