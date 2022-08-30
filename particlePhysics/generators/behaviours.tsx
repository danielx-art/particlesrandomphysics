import { default as magneticdipole } from "../behaviours/constantMagneticField";
import { default as gravity } from "../behaviours/gravity";
import { default as rgbDynamic } from "../behaviours/rgbdynamic";

const behaviours = [];

//behaviours.push(magneticdipole);
//behaviours.push(gravity);
behaviours.push(rgbDynamic);

export { behaviours };
