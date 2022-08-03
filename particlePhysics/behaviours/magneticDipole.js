export default magneticDipole = function (particle) {
  if (mdipole instanceof Function) {
    let args = mdipoleDependencies.map((dependency) => particle[dependency]);
    let calculated_m = mdipole(...args);
    mdipole = calculated_m;
  }

  particle.dir = vec().copy(mdipole).setLength(1);

  const self = {
    title: "magnet",
    descripition: "",
    m: mdipole,
    particle,

    field: (pointInSpace) => {
      let vecr = vec().copy(pointInSpace).sub(particle.pos);
      let versorr = vec().copy(vecr).setLength(1);
      let r = vecr.length();
      if (r > 1) {
        //security measure
        let B = vec().copy(versorr);
        B.multiplyScalar(3 * m.dot(versorr));
        B.sub(m);
        B.divideScalar(r * r * r);
        return B;
      }
      return createVector();
    },

    forces: (agents) => {
      Array.isArray(agents) ? true : (agents = [agents]); //if only one is passed

      let Fmagres = createVector();
      let Tmagres = createVector();

      agents.forEach(function (agent, i) {
        if (!agent.physics.lengthnet) {
          return;
        }

        let B = agent.lengthnet.field(particle.pos);

        //translation, force
        //approximation of partial derivatives
        let dinf = 0.000000001;
        let Bx = agent.lengthnet
          .field(vec(particle.pos.x + dinf, particle.pos.y, particle.pos.z))
          .sub(B)
          .divideScalar(dinf)
          .multiplyScalar(m.x);
        let By = agent.lengthnet
          .field(vec(particle.pos.x, particle.pos.y + dinf, particle.pos.z))
          .sub(B)
          .divideScalar(dinf)
          .multiplyScalar(m.y);
        let Bz = agent.lengthnet
          .field(vec(particle.pos.x, particle.pos.y, particle.pos.z + dinf))
          .sub(B)
          .divideScalar(dinf)
          .multiplyScalar(m.z);
        let Fmag = Bx.add(By).add(Bz);
        Fmagres.add(Fmag);

        //rotation, alignment, torque
        Tmagres.add(m.cross(B));
      });

      particle.acl.add(Fmagres.divideScalar(particle.inertialMass));
      particle.angacl.add(Tmagres.divideScalar(particle.momentInertia));
    },

    hasMoved: (newState) => {
      let mmag = m.length();
      m.copy(newState.dir).setLength(mmag);
    },

    merge: (otherMagnet) => {
      let m2 = vec().copy(otherMagnet.m);
      m.add(m2);
    },
  };

  return self;
};
