  
export function rectangle (x,y,width,height,) {
    const self = {
        x,
        y,
        width,
        height,
    }

    self.contains = function(point){
        return (
        point.x >= self.x - self.width/2  &&
        point.x <= self.x + self.width/2  &&
        point.y >= self.y - self.height/2 &&
        point.y <= self.y + self.height/2
        );
    }

    self.intersects = function(range) {
        return !(
        range.x - range.width/2 > this.x + this.width/2   ||
        range.x + range.width/2 < this.x - this.width/2   ||
        range.y - range.heigth/2 > this.y + this.heigth/2 ||
        range.y + range.heigth/2 < this.y - this.heigth/2
        );
    }

    self.show =function(p5inst, color = 200) {
        p5inst.noFill();
        p5inst.stroke(color);
        p5inst.rect(self.x - self.width/2, self.y - self.height/2, self.width, self.height);
    }

    return self;
};

// circle class for a circle shaped query
export function circle (x, y, r) {
    
    const self = {
        x,
        y,
        r,
        get width(){
            return 2*r;
        },
        get height(){
            return 2*r;
        }
    }

    self.contains = function(point) {
        // check if the point is in the circle by checking if the euclidean distance of
        // the point and the center of the circle if smaller or equal to the radius of
        // the circle
        let d = Math.pow(point.x - self.x, 2) + Math.pow(point.y - self.y, 2);
        return d <= self.r*self.r;
    }

    self.intersects = function(range) {
        var xDist = Math.abs(range.x - self.x);
        var yDist = Math.abs(range.y - self.y);

        var r = self.r;

        var w = range.width/2;
        var h = range.height/2;

        var edges = Math.pow(xDist - w, 2) + Math.pow(yDist - h, 2);

        // no intersection
        if (xDist > r + w || yDist > r + h) return false;

        // intersection within the circle
        if (xDist <= w || yDist <= h) return true;

        // intersection on the edge of the circle
        return edges <= self.r*self.r;
    }

    self.show =function(p5inst, color = 200) {
        p5inst.noFill();
        p5inst.stroke(color);
        p5inst.ellipse(self.x, self.y, self.width, self.height);
    }

    return self;
}

/*ARRAY*/

export function pickRandom (array, num) {
    if(!Array.isArray(array) || num <= 0){
        return false;
    }
    let copy = [...array];
    if(num == 1){
        return copy[Math.floor(Math.random()*copy.length)];
    } else {
        let randomList = []
        for(let i=0; i<num; i++){
            let index = Math.floor(Math.random()*copy.length);
            let newItem = copy.splice(index,1);
            randomList.push(...newItem);
        }
        return randomList;
    }
}

export function lerpStretchClamp(value, fromMin, fromMax, min, max){
    if(value < fromMin) {
        return min;
    } 
    if(value > fromMax) {
        return max;
    }
    return ((max-min)/(fromMax-fromMin))*(value - fromMin) + min;
}

export function executeFunctionByName(functionName, context /*, args */) {
    var args = Array.prototype.slice.call(arguments, 2);
    var namespaces = functionName.split(".");
    var func = namespaces.pop();
    
    //get deeper into nested contexts
    for (var i = 0; i < namespaces.length; i++) {
        context = context[namespaces[i]];
    }
    return context[func].apply(context, args);
}