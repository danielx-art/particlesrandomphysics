import { Vector3 } from "three";
import { Iparallelepiped } from "../shapes";
import vec from "../vetores";

export function maxForceConst(args: {
  index: number;
  num: number;
  boundary: Iparallelepiped;
  positions: Array<Vector3>;
}) {
  return 0.01;
}
