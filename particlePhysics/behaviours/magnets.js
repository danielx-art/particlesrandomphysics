var createMagnet = function(
    particle,
    mdipole,
    mdipoleDependencies
    ) {

    if (mdipole instanceof Function) {
        let args = mdipoleDependencies.map((dependency)=>particle[dependency]);
        let calculated_m = mdipole(...args);
        mdipole = calculated_m;
    }

    particle.dir = vec().copy(mdipole).setMag(1);

    const self = {
        
        type: 'magnet',
        m: mdipole,
        particle,

        field: (pointInSpace) => {
            let vecr = vec().copy(pointInSpace).sub(particle.pos)
            let versorr = vec().copy(vecr).setMag(1);
            let r = vecr.mag();
            if(r > 1) { //security measure
                let B = vec().copy(versorr);
                B.mult(3*( m.dot(versorr) ));
                B.sub(m);
                B.div(r*r*r);
                return B;
            }
            return createVector();
        },

        forces: (agents) => {
            Array.isArray(agents) ? true : agents = [agents]; //if only one is passed
            
            let Fmagres = createVector();
            let Tmagres = createVector();

            agents.forEach(function(agent, i){

                if(!agent.physics.magnet){
                    return;
                }

                let B = agent.magnet.field(particle.pos);

                //translation, force
                //approximation of partial derivatives
                let dinf = 0.000000001;
                let Bx = agent.magnet.field(vec(particle.pos.x + dinf, particle.pos.y, particle.pos.z)).sub(B).div(dinf).mult(m.x);
                let By = agent.magnet.field(vec(particle.pos.x, particle.pos.y + dinf, particle.pos.z)).sub(B).div(dinf).mult(m.y);
                let Bz = agent.magnet.field(vec(particle.pos.x, particle.pos.y, particle.pos.z + dinf)).sub(B).div(dinf).mult(m.z);
                let Fmag = Bx.add(By).add(Bz);
                Fmagres.add(Fmag);

                //rotation, alignment, torque
                Tmagres.add(m.cross(B));
            });

            particle.acl.add(Fmagres.div(particle.inertialMass));
            particle.angacl.add(Tmagres.div(particle.momentInertia));
        },

        hasMoved: (newState) => {
            let mmag = m.mag();
            m.copy(newState.dir).setMag(mmag);
        },

        merge: (otherMagnet) => {
            let m2 = vec().copy(otherMagnet.m);
            m.add(m2);
        }
    };

    return self;

};