
class Point3d {
    constructor(x, y, z, userData) {
      this.x = x;
      this.y = y;
      this.z = z;
      this.userData = userData;
    }
}
  
class Parallelepiped {
    constructor(x, y, z, w, h, l) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
        this.h = h;
        this.l = l;
        this.width = w;
        this.height = h;
        this.length = l;
    }

    contains(point) {
        return (
        point.x >= this.x - this.w &&
        point.x <= this.x + this.w &&
        point.y >= this.y - this.h &&
        point.y <= this.y + this.h &&
        point.z >= this.z - this.l &&
        point.z <= this.z + this.l
        );
    }

    intersects(range) {
        return !(
        range.x - range.w > this.x + this.w ||
        range.x + range.w < this.x - this.w ||
        range.y - range.h > this.y + this.h ||
        range.y + range.h < this.y - this.h ||
        range.z - range.l > this.z + this.l ||
        range.z + range.l < this.z - this.l
        );
    }
}

// circle class for a circle shaped query
class Sphere {
    constructor(x, y, z, r) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.r = r;
        this.rSquared = this.r * this.r;
    }

    contains(point) {
        // check if the point is in the circle by checking if the euclidean distance of
        // the point and the center of the circle if smaller or equal to the radius of
        // the circle
        let d = Math.pow(point.x - this.x, 2) + Math.pow(point.y - this.y, 2) + Math.pow(point.z - this.z, 2);
        return d <= this.rSquared;
    }

    intersects(range) {
        var xDist = Math.abs(range.x - this.x);
        var yDist = Math.abs(range.y - this.y);
        var zDist = Math.abs(range.z - this.z);

        // radius of the circle
        var r = this.r;

        var w = range.w;
        var h = range.h;
        var l = range.l;

        var edges = Math.pow(xDist - w, 2) + Math.pow(yDist - h, 2) + Math.pow(zDist - l, 2);

        // no intersection
        if (xDist > r + w || yDist > r + h || zDist > r + l) return false;

        // intersection within the circle
        if (xDist <= w || yDist <= h || zDist <= l) return true;

        // intersection on the edge of the circle
        return edges <= this.rSquared;
    }
}

class QuadTree3D {
    constructor(boundary, capacity) {
        if (!boundary) {
        throw TypeError('boundary is null or undefined');
        }
        if (!(boundary instanceof Rectangle)) {
        throw TypeError('boundary should be a Rectangle');
        }
        if (typeof capacity !== 'number') {
        throw TypeError(
            `capacity should be a number but is a ${typeof capacity}`
        );
        }
        if (capacity < 1) {
        throw RangeError('capacity must be greater than 0');
        }
        this.boundary = boundary;
        this.capacity = capacity;
        this.points = [];
        this.divided = false;
    }

    subdivide() {
        let x = this.boundary.x;
        let y = this.boundary.y;
        let z = this.boundary.z;
        let w = this.boundary.w / 2;
        let h = this.boundary.h / 2;
        let l = this.boundary.l / 2;

        let nef = new Parallelepiped(x + w, y - h, z - l, w, h, l);
        this.northeastfront = new QuadTree3D(nef, this.capacity);
        let nwf = new Parallelepiped(x - w, y - h, z - l, w, h, l);
        this.northwestfront = new QuadTree3D(nwf, this.capacity);
        let sef = new Parallelepiped(x + w, y + h, z - l, w, h, l);
        this.southeastfront = new QuadTree3D(sef, this.capacity);
        let swf = new Parallelepiped(x - w, y + h, z - l, w, h, l);
        this.southwestfront = new QuadTree3D(swf, this.capacity);
        let neb = new Parallelepiped(x + w, y - h, z + l, w, h, l);
        this.northeastback = new QuadTree3D(neb, this.capacity);
        let nwb = new Parallelepiped(x - w, y - h, z + l, w, h, l);
        this.northwestback = new QuadTree3D(nwb, this.capacity);
        let seb = new Parallelepiped(x + w, y + h, z + l, w, h, l);
        this.southeastback = new QuadTree3D(seb, this.capacity);
        let swb = new Parallelepiped(x - w, y + h, z + l, w, h, l);
        this.southwestback = new QuadTree3D(swb, this.capacity);

        this.divided = true;
    }

    insert(point) {
        if (!this.boundary.contains(point)) {
        return false;
        }

        if (this.points.length < this.capacity) {
        this.points.push(point);
        return true;
        }

        if (!this.divided) {
        this.subdivide();
        }

        if (
        this.northeastfront.insert(point) ||
        this.northwestfront.insert(point) ||
        this.southeastfront.insert(point) ||
        this.southwestfront.insert(point) ||
        this.northeastback.insert(point) ||
        this.northwestback.insert(point) ||
        this.southeastback.insert(point) ||
        this.southwestback.insert(point)
        ) {
        return true;
        }
    }

    query(range, found) {
        if (!found) {
        found = [];
        }

        if (!range.intersects(this.boundary)) {
        return found;
        }

        for (let p of this.points) {
        if (range.contains(p)) {
            found.push(p);
        }
        }
        if (this.divided) {
        this.northwestfront.query(range, found);
        this.northeastfront.query(range, found);
        this.southwestfront.query(range, found);
        this.southeastfront.query(range, found);
        this.northwestback.query(range, found);
        this.northeastback.query(range, found);
        this.southwestback.query(range, found);
        this.southeastback.query(range, found);
        }

        return found;
    }

    remove(point) {
        let indexToRemove = this.points.indexOf(point);
        if(indexToRemove> -1){
            this.points.splice(indexToRemove,1);
            return true;
        }else{
            if(this.divided){
                if(this.northeastfront.remove(point)) {return true};
                if(this.northwestfront.remove(point)) {return true};
                if(this.southeastfront.remove(point)) {return true};
                if(this.southwestfront.remove(point)) {return true};
                if(this.northeastback.remove(point)) {return true};
                if(this.northwestback.remove(point)) {return true};
                if(this.southeastback.remove(point)) {return true};
                if(this.southwestback.remove(point)) {return true};
            }
        }
        return false;
    }


}