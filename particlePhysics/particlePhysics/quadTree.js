const quadTree = function(boundary, capacity) {

    if (!boundary) {
        throw TypeError('boundary is null or undefined');
    }
    // if (!(boundary instanceof Rectangle)) {
    //     throw TypeError('boundary should be a Rectangle');
    // }
    if (typeof capacity !== 'number') {
        throw TypeError(`capacity should be a number but is a ${typeof capacity}`);
    }
    if (capacity < 1) {
        throw RangeError('capacity must be greater than 0');
    }

    const self = {
        boundary,
        capacity,
        points: [],
        divided: false
    };

    self.subdivide = function() {
        let x = self.boundary.x;
        let y = self.boundary.y;
        let w = self.boundary.width / 2;
        let h = self.boundary.height / 2;

        let ne = rectangle(x + w/2, y - h/2, w, h);
        self.northeast = quadTree(ne, self.capacity);
        let nw = rectangle(x - w/2, y - h/2, w, h);
        self.northwest = quadTree(nw, self.capacity);
        let se = rectangle(x + w/2, y + h/2, w, h);
        self.southeast = quadTree(se, self.capacity);
        let sw = rectangle(x - w/2, y + h/2, w, h);
        self.southwest = quadTree(sw, self.capacity);

        self.divided = true;
    }

    self.insert = function(point) {
        if (!self.boundary.contains(point)) {
            //console.log(self.boundary);
            //console.log("point not contained in boundary") //debugg
            return false;
        }

        if (self.points.length < self.capacity) {
            self.points.push(point);
            //console.log("point "+point.x, point.y+" inserted") //debugg
            return true;
        }

        if (!self.divided) {
            self.subdivide();
        }

        if (
            self.northeast.insert(point) ||
            self.northwest.insert(point) ||
            self.southeast.insert(point) ||
            self.southwest.insert(point)
        ) {
            //console.log(self.count()); //debugg
            return true;
        }
    }

    self.query = function(range, found) {
        if (!found) {
            found = [];
        }

        if (!range.intersects(self.boundary)) {
            return found;
        }

        for (let p of self.points) {
        if (range.contains(p)) {
            found.push(p);
        }
        }
        if (self.divided) {
            self.northwest.query(range, found);
            self.northeast.query(range, found);
            self.southwest.query(range, found);
            self.southeast.query(range, found);
        }

        return found;
    }

    self.remove = function(point) {
        console.log("being removed"); //debugg
        let indexToRemove = self.points.indexOf(point);
        if(indexToRemove> -1){
            self.points.splice(indexToRemove,1);
            return true;
        }else{
            if(self.divided){
                if(self.northeast.remove(point)) {return true};
                if(self.northwest.remove(point)) {return true};
                if(self.southeast.remove(point)) {return true};
                if(self.southwest.remove(point)) {return true};
            }
        }
        return false;
    }

    self.count = function() {
        let count = self.points.length;
        if(self.divided){
            count += self.northeast.count() + self.northwest.count() + self.southeast.count() + self.southwest.count();
        }
        return count;
    }

    self.show = function(p5inst) {
        self.boundary.show(p5inst);
        if(self.divided) {
            self.northwest.show(p5inst);
            self.northeast.show(p5inst);
            self.southwest.show(p5inst);
            self.southeast.show(p5inst);
        }
    }

    return self;

}