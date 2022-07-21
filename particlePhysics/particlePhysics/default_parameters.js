export default defaultSystemParameters = {
    
    num: 3,

    boundary: rectangle(0,0,720,720),

    posGenerator: (i)=>{ return vec(Math.random()*(boundary.width-200)+100, Math.random()*(boundary.height-200)+100) },

    dirGenerator: (i)=>{ return vec().random2D()},

    inertialMass: (i)=>{return 1},
    momentInertia: (i)=>{return 1000},

    movement: "dynamic",

    initialVelocity: (i) => {return vec()},
    initialAngularVelocity: (i) => {return vec()},
    maxForce: (i)=>{return 10},
    maxTorque: (i)=>{return 0.5},
    maxSpeed: (i)=>{return 0.1},
    maxAngVel: (i)=>{return 0.1},
    translationDamping: (i)=>{return 1},
    rotationDamping: (i)=>{return 1},

    wrap: "bounce",

    collisionDetection: 'QUADTREE',

    queryRadius: 500,

    safeRadius: 5,

    merge: false,

    behaviours: (i) => {return [{
        type: 'externalForce',
        intensity: 10,
        field: () => {return vec(0,1)} //just a constant vertical gravity
    }]},

    display: (i) => {
        return {
            scale: 5, 
            displayFunction: (p5instance, radius, pos) => {
                p5instance.noStroke();
                p5instance.fill(255);
                p5instance.ellipse(pos.x, pos.y, radius, radius);
            },
            displayDependencies: ["pos"],
    
            displayForce: (p5instance, scale, pos, inertialMass, acl) => {
                p5instance.stroke(255,0,0);
                let aclTemp = vec().copy(acl).mult(10*scale/inertialMass);
                aclTemp.mag() != 0 ? aclTemp.setMag(Math.log(aclTemp.mag())+5) : null;
                p5instance.line(pos.x, pos.y, pos.x + aclTemp.x, pos.y + aclTemp.y)
            },
            displayForceDependencies: ["pos","inertialMass","acl"], //has to be in the same order than in the arguments
    
            displayDirection: (p5instance, scale, pos, dir) => {
                p5instance.stroke(10,50,20);
                let dirTemp = vec().copy(dir).mult(scale);
                p5instance.line(pos.x, pos.y, pos.x + dirTemp.x, pos.y + dirTemp.y)
            },
            displayDirectionDependencies: ["pos","dir"]
        }
    }
}