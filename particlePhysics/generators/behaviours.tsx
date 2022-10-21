import { default as magneticDipole } from "../behaviours/magneticDipole";
import { default as gravity } from "../behaviours/gravity";
import { default as boids } from "../behaviours/boids";
import { default as ambientGravity } from "../behaviours/ambientGravity";
import { behavioursFunction } from "../types";

//import { default as rgbDynamic } from "../behaviours/rgbdynamic";

const behaviours = {} as { [key: string]: behavioursFunction };

let attachBehaviour = (name: string, behaviour: behavioursFunction) =>
  (behaviours[name] = behaviour);

attachBehaviour("magneticDipole", magneticDipole);
attachBehaviour("gravity", gravity);
attachBehaviour("boids", boids);
attachBehaviour("ambientGravity", ambientGravity);

export { behaviours };
