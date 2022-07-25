
const createFieldTracer = function(
    traceNum = 10,
    traceLen = 10,
    traceSpacing = 10,
    traceWeight = 1,
    traceGroup = [],
    traceBehaviour = ""
){

    const self = {
        traceNum,
        traceGroup,
        traceBehaviour,
        tracers: []
    }

    for(let i=0; i<traceNum; i++){
        self.tracers.push(createTracer(traceLen, traceSpacing, traceWeight, traceGroup, traceBehaviour));
    };

    self['trace'] = function(p5inst, tcolor = [0,0,0], type = "field"){
        for(let t of self.tracers){
            t.trace(p5inst, tcolor, type);
        }
    }
    return self;
}

/* --------------------------------------------------------------
-----------------------------------------------------------------
------------------------TRACER FACTORY---------------------------
-----------------------------------------------------------------
-----------------------------------------------------------------*/
const createTracer = function(
    len = 10,
    spacing = 10,
    strokeWeight = 1,
    group = [],
    behaviour = "",
) {
    const self = {
        len,
        group,
    };

    self['calculateField'] = function(pos){
        let totalField = vec();
        for(const particle of group){
            //access that behaviour of that particle and calculate total field with all particles of group
            let beh = particle[behaviour];
            let x = pos.x;
            let y = pos.y;
            let z = pos.z;
            totalField.add(beh.field(x,y,z));
        };
        return totalField.mult(spacing*100000).limit(spacing);
    };

    self['trace'] = function(s, tcolor = [0,0,0], type = "field"){
        if(!Array.isArray(tcolor) && !isNaN(tcolor)){
            tcolor = [tcolor, tcolor, tcolor];
            s.stroke(tcolor[0], tcolor[1], tcolor[2]);
        } else if (isNaN(tcolor)) {
            s.stroke(tcolor);
        }
        let pos = vec(Math.random()*s.width, Math.random()*s.height);
        for(let i=0; i<len; i++){
            let field = self.calculateField(pos);
            if(type == "equipotencials"){
                field.rotate(Math.PI/2);
            }
            let npos = vec().copy(pos);
            npos.add(field);
            
            s.strokeWeight(strokeWeight);
            s.noFill();
            s.line(pos.x, pos.y, npos.x, npos.y);
            //s.ellipse(pos.x, pos.y, 10, 10);
            //s.stroke(100,i,0);
            //s.ellipse(npos.x, npos.y, 8,8);
            pos.add(field);
        }
    };

    return self;
};


/*----------------------------------------------
-------------------COLOR MAP--------------------
-----------------------------------------------*/

const createColorMap = function(
    s,
    colorShader = (s,x,y,z,field) => [x,y,z,255],
    res = [20,20],
    group = [],
    behaviour = ""
){

    const self = {
        s,
        resX: res[0],
        resY: res[1],
        group,
        behaviour,
        colorShader
    }

    self.cols = Math.floor(s.width/self.resX);
    self.rows = Math.floor(s.height/self.resY);

    calculateField = function(pos){
        let totalField = vec();
        for(const particle of group){
            //access that behaviour of that particle and calculate total field with all particles of group
            let beh = particle[behaviour];
            let x = pos.x;
            let y = pos.y;
            let z = pos.z;
            totalField.add(beh.field(x,y,z));
        };
        return totalField;
    };

    self['make'] = function(){
        for(let j=0; j<self.cols; j++){
            for(let i=0; i<self.rows; i++){
                let index = j + i*self.cols;
                let pos = vec(self.resX*(j+1/2), self.resY*(i+1/2), 0)
                let fieldCenter = calculateField(pos);
                let ccolor = colorShader(s,self.resX*(j+1/2),self.resY*(i+1/2),0,fieldCenter);
                s.noStroke();
                s.fill(ccolor[0], ccolor[1], ccolor[2], ccolor[3]);
                s.rect(j*self.resX, i*self.resY, self.resX, self.resY);
            }
        }
    }

    return self;
}

