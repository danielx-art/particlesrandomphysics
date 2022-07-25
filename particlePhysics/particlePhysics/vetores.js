import * as THREE from 'three';

export default vec = function(x=0,y=0,z=0){ return new THREE.Vector3(x,y,z) };

//nomenclature changes - dont know if its gonna work but if dont i just find and replace
THREE.Vector3.prototype.mult = THREE.Vector3.prototype.multiplyScalar;
THREE.Vector3.prototype.div = THREE.Vector3.prototype.divideScalar;
THREE.Vector3.prototype.mag = THREE.Vector3.prototype.length;
THREE.Vector3.prototype.setMag = THREE.Vector3.prototype.setLength;
THREE.Vector3.prototype.limit(limit) = THREE.Vector3.prototype.clampLength(0,limit);
THREE.Vector3.prototype.rotate(ax=0,ay=0,az=0) = THREE.Vector3.prototype.applyEuler(new THREE.Euler(ax, ay, az, 'XYZ'));
THREE.Vector3.prototype.angleBetween = THREE.Vector3.prototype.angleTo
