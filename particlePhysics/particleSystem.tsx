import { parametersType, Tgenerator, TparticleSystem } from "./types";
import createParticle from "./particle";
import octaTree from "./octaTree";
import { sphere } from "./shapes";
import vec from "./vetores";

export default function createParticleSystem(args: parametersType) {
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
    behaviours,
    displayGenerator,
  } = { ...args };

  //Initialize all the particles

  let particleBehaviours = behaviours.map((behaviour) => behaviour());

  const self: { [key: string]: any } = {
    num,
    boundary,
    wrap: wrapGenerator.function,
    queryRadius,
    safeRadius,
    merge,
    particles: [],
    physics: particleBehaviours.map(
      (behaviour) => behaviour.metadata
    ) as unknown,
  };

  //Collision Detection
  self.collisionDetection = octaTree(boundary, 8);

  let HANDLE_GENERATOR = function (generator: Tgenerator, args: any) {
    //make generators only spit arrays
    if (typeof generator.function === "number") return generator.function;

    let arrOrValue = generator.function(args);
    return Array.isArray(arrOrValue)
      ? arrOrValue[args.index] //pre calculated generator[i] wich is a Vector3 or number
      : arrOrValue; //just single calculated Vector3 or number thats possibly different for each i
  };

  let positions = posGenerator.function(num, boundary);

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
      particleBehaviours,
      //display: HANDLE_GENERATOR(displayGenerator, defaultGenArgs),
    });

    self.particles.push(newParticle);

    self.collisionDetection.insert(newParticle);
  }

  //interactions
  self.update = () => {
    for (let i = 0; i < self.num; i++) {
      let unsafeRange = sphere(
        vec().copy(self.particles[i].pos),
        self.safeRadius
      );
      let tooClose = self.collisionDetection.query(unsafeRange);
      let range = sphere(vec().copy(self.particles[i].pos), self.queryRadius);
      let inRange = self.collisionDetection.query(range);
      let agents = inRange.filter((x: any) => !tooClose.includes(x));
      self.particles[i].applyForces(agents);
    }
  };

  let repopulateTree = () => {
    self.collisionDetection = octaTree(self.boundary, 8);
    for (let i = 0; i < self.num; i++) {
      self.collisionDetection.insert(self.particles[i]);
    }
  };

  //move
  self.move = () => {
    for (let i = 0; i < self.num; i++) {
      self.particles[i].move();
      self.wrap(self.particles[i], self.boundary);

      if (self.merge == true) {
        let closeRange = sphere(
          vec().copy(self.particles[i].pos),
          self.safeRadius
        );
        let forMerge = self.collisionDetection.query(closeRange);
        let indexThis = forMerge.indexOf(self.particles[i]);
        if (indexThis > -1) {
          forMerge.splice(indexThis, 1);
        }
        let numMerge = forMerge.length;

        for (let j = 0; j < numMerge; j++) {
          self.particles[i].merge(forMerge[j]); //this changes position of the particle, but since I already did the wrapping, then it should not be a concern that the particle will be out of the tree boundary

          //then I have to remove the particle wich has been merged with this one from both the tree and particles array
          let indexToRemove = self.particles.indexOf(forMerge[j]);

          /*interesting note:
          Since I'm looping trough the particles in a crescent index "i", then
          if particle "i" wants to merge with particle "indexToRemove", then I didnt
          yet went through particle "indexToRemove", because if so particle "i" would
          be already merged, so "i" will always be less then "indexToRemove".
          */

          //delete the second particle from tree
          self.collisionDetection.remove(self.particles[indexToRemove]);

          //delete the second particle from self.particles
          if (indexToRemove > -1) {
            self.particles.splice(indexToRemove, 1);
            self.num--; //so that we dont get array out of bounds
          }
        }
      }
    } //particle loop
  };

  return self as TparticleSystem;
}
