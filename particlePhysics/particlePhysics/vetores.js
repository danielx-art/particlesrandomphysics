// //vetores
// const createVector = function( x = 0, y = 0, z = 0 ) {

//     var self = {
//         x,
//         y,
//         z,
//         copy: function(other){
//             self.x = other.x;
//             self.y = other.y;
//             self.z = other.z;
//             return this;
//         },
//         add: function(other){
//             self.x = self.x + other.x;
//             self.y = self.y + other.y;
//             self.z = self.z + other.z;
//             return this;
//         },
//         sub: function(other){
//             self.x = self.x - other.x;
//             self.y = self.y - other.y;
//             self.z = self.z - other.z;
//             return this;
//         },
//         mult: function(escalar){
//             self.x = self.x*escalar;
//             self.y = self.y*escalar;
//             self.z = self.z*escalar;
//             return this;
//         },
//         div: function(escalar){
//             if(escalar == 0) {
//                 escalar += 0.01;
//             }
//             return self.mult(1/escalar);
//         },
//         dot: function(other){
//             return self.x*other.x + self.y*other.y + self.z*other.z;
//         },
//         cross: function(other) {
//             const tempx = self.y * other.z - self.z * other.y;
//             const tempy = self.z * other.x - self.x * other.z;
//             const tempz = self.x * other.y - self.y * other.x;
//             //self.x = tempx;
//             //self.y = tempy;
//             //self.z = tempz;
//             return createVector(tempx, tempy, tempz);
//         },
//         mag: function(){
//             return Math.sqrt(self.dot(this));
//         },
//         setMag: function(newmag){
//             self.mult(newmag/self.mag());
//             return this;
//         },
//         limit: function(uplimit){
//             if(self.mag() > uplimit) {
//                 self.setMag(uplimit);
//             }
//             return this;
//         },
//         heading: function(){
//             return Math.atan2(self.y, self.x);
//         },
//         rotate: function(a){
//             let newHeading = self.heading() + a;
//             const mag = self.mag();
//             self.x = Math.cos(newHeading) * mag;
//             self.y = Math.sin(newHeading) * mag;
//             return this;
//         },
//         angleBetween: function angleBetween(v) {
//             const dotmagmag = self.dot(v) / (self.mag() * v.mag());
//             let angle;
//             // Mathematically speaking: the dotmagmag variable will be between -1 and 1
//             // inclusive. Practically though it could be slightly outside this range due
//             // to floating-point rounding issues. This can make Math.acos return NaN.
//             //
//             // Solution: we'll clamp the value to the -1,1 range
//             angle = Math.acos(Math.min(1, Math.max(-1, dotmagmag)));
//             angle = angle * Math.sign(self.cross(v).z || 1);
//             if (self.p5) {
//               angle = self.p5._fromRadians(angle);
//             }
//             return angle;
//           },
//           random2D: function(scl=1){
//             self.x = scl;
//             self.y = 0
//             self.z = 0;
//             return vec(scl,0,0).rotate(Math.random()*Math.PI*2);
//           },
//     }

//     return self;

// };

// const vec = createVector;

// export default vec;
