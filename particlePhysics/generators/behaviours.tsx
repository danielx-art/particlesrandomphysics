import { Vector3 } from "three";
import { Iparallelepiped } from "../shapes";
import vec from "../vetores";

import { default as magneticdipole } from "../behaviours/magneticDipole";

const behaviours = [];

behaviours.push(magneticdipole);

export { behaviours };
