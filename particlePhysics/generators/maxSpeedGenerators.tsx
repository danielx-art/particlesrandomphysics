import { Vector3 } from "three";
import { Iparallelepiped } from "../shapes";
import vec from "../vetores";

export function maxSpeedConstOne(args: {
  index: number;
  num: number;
  boundary: Iparallelepiped;
  positions: Array<Vector3>;
}) {
  return 0.1;
}

export function maxSpeedConstSmall(args: {
  index: number;
  num: number;
  boundary: Iparallelepiped;
  positions: Array<Vector3>;
}) {
  return 0.5;
}
