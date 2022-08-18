import vec from "./vetores";
import gravity from "./behaviours/gravity";
import { Tparticle, TparticlePreBody } from "./types";

/* --------------------------------------------------------------
-----------------------------------------------------------------
---------------------THE PARTICLE FACTORY------------------------
-----------------------------------------------------------------
-----------------------------------------------------------------*/

export default function createParticle({
  position = vec(),
  direction = vec(0, -1),
  inertialMass = 1,
  momentInertia = 1000,

  movement = true,
  initialVelocity = vec(),
  initialAngularVelocity = vec(),

  maxForce = 10,
  maxTorque = 0.1,
  maxSpeed = 0.1,
  maxAngVel = 0.3,
  translationDamping = 0.9,
  rotationDamping = 0.8,

  particleBehaviours = [
    { metadata: {}, attach: (particle: TparticlePreBody) => {} },
  ],
}): Tparticle {
  const self: any = {
    pos: position,
    dir: direction,
    inertialMass,
    momentInertia,
    movement,
    //translation
    vel: initialVelocity,
    acl: vec(),
    //rotation
    angvel: initialAngularVelocity,
    angacl: vec(),

    get x() {
      return this.pos.x;
    },

    get y() {
      return this.pos.y;
    },

    get z() {
      return this.pos.z;
    },
    physics: {},
  };
  /*note:
  this "self" could be typed better, Idk if I should refactor it, because the problem is that the functions
  assigned later bellow need access to the properties of this self or if I should use Object.assign({},self, {newFuntion: ...})
  everytime I assign something, but the problem on the latter is that I will have to use & type operator creating a new type
  everytime I do this, which I think it's not an ok idea.
  */

  /*
  BEHAVIOURS ASSIGNMENT
  */

  for (const behaviour of particleBehaviours) {
    behaviour.attach(self as TparticlePreBody);
    /*note:
    "behaviour(self)" is not a pure function, we need to assign, or "attach", to the physics 
    object of the particle this said behaviour, so in other words it needs to set stuff on its "parent particle", the "self",
    because the behaviour needs access to the particles properties. But we need to be careful here, the behaviour
    should only access the properties of the particle (self) as it is above, and not the methods assigned later bellow.
    */
  }

  let physicsList = Object.keys(self.physics);

  self["applyForces"] = (agents: any) => {
    physicsList.forEach((phenom) => {
      self.physics[phenom].forces(agents);
    });
  };

  /* add the fact that movement false just dont move*/
  self["move"] = () => {
    //translation - Euler - maybe implement runge kutta 4th?
    //if (self.acl.length() > 0) console.log(self.acl); //debugg
    self.acl.clampLength(0, maxForce / inertialMass);
    self.vel.add(self.acl);
    self.vel.multiplyScalar(translationDamping);
    self.vel.clampLength(0, maxSpeed);

    self.pos.add(self.vel);
    self.acl.multiplyScalar(0);

    //rotation
    self.angacl.clampLength(0, maxTorque / momentInertia);
    self.angvel.add(self.angacl);
    self.angvel.multiplyScalar(rotationDamping);
    self.angvel.clampLength(0, maxAngVel);
    let deltadir = self.angvel.cross(self.dir);
    self.dir.add(deltadir).clampLength(0, 1);
    self.angacl.multiplyScalar(0);

    //notify all behaviours
    physicsList.forEach((phenom) => {
      self.physics[phenom].hasMoved(self as TparticlePreBody);
    });
  };

  //merge function
  self["merge"] = (particleForMerge: any) => {
    let p1 = self;
    let m1 = p1.inertialMass;
    let x1 = vec().copy(p1.pos);
    let v1 = vec().copy(p1.vel);
    let I1 = p1.momentInertia;
    let w1 = vec().copy(p1.angvel);

    let p2 = particleForMerge;
    //1.mass
    let m2 = p2.inertialMass;
    let mcm = m1 + m2;
    //2.position
    let x2 = vec().copy(p2.pos);
    let xcm = vec()
      .copy(x1.multiplyScalar(m1))
      .add(x2.multiplyScalar(m2))
      .divideScalar(mcm);
    //3.velocity
    let v2 = vec().copy(p2.vel);
    let vcm = vec()
      .copy(v1.multiplyScalar(m1))
      .add(v2.multiplyScalar(m2))
      .divideScalar(mcm);
    //4.moment of inercia
    let I2 = p2.momentInertia;
    let Icm = I1 + I2;
    //5.angular velocity
    let w2 = vec().copy(p2.angvel);
    let wcm = vec()
      .copy(w1.multiplyScalar(I1))
      .add(w2.multiplyScalar(I2))
      .divideScalar(Icm);

    //now attribute this do particle
    self.inertialMass = mcm;
    self.pos = vec().copy(xcm);
    self.vel = vec().copy(vcm);
    self.momentInertia = Icm;
    self.angvel = vec().copy(wcm);

    //notify the merge to all behaviours
    physicsList.forEach((phenom) => {
      self.physics[phenom].merge(particleForMerge.physics[phenom]);
    });
  };

  return self as Tparticle;
}
