import { default as magneticdipole } from "../behaviours/magneticDipole";
import { default as gravity } from "../behaviours/gravity";
import { default as boids } from "../behaviours/boids";
//import { default as rgbDynamic } from "../behaviours/rgbdynamic";

const behaviours = [];

behaviours.push(magneticdipole);
behaviours.push(gravity);
behaviours.push(boids);
//behaviours.push(rgbDynamic);

export { behaviours };
