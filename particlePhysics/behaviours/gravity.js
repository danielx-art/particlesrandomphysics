
export default createGravity = function(
    particle,
    G=10
    ) {

    const self = {
        
        type: 'gravity',
        G,
        particle,

        field: (pointInSpace) => {
            let vecr = vec().copy(pointInSpace).sub(particle.pos)
            let versorr = vec().copy(vecr).setMag(1);
            let r = vecr.mag();
            if(r > 1) { //security measure
                let g = vec().copy(versorr);
                g.mult(-G*particle.inertialMass);
                g.div(r*r);
                return g;
            }
            return vec();
        },

        forces: (agents) => {
            Array.isArray(agents) ? true : agents = [agents]; //if only one is passed
            
            let Fgres = createVector();

            agents.forEach(function(agent, i){

                if(!agent.physics.gravity){
                    return;
                }

                let g = agent.physics.gravity.field(particle.pos);
                let Fg = g.mult(particle.inertialMass);
                Fgres.add(Fg);

            });
         
            particle.acl.add(Fgres.div(particle.inertialMass));
        },

        hasMoved: (newState) => {
            //no changes on the body need to be done
        },

        merge: (otherThis) => {
            //mass merges by itself
        }
    };

    return self;

};