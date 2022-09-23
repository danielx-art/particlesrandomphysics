import { Vector3 } from "three";
import { Iparallelepiped } from "../shapes";

export function maxAngVelRandom(args: {
  index: number;
  num: number;
  boundary: Iparallelepiped;
  positions: Vector3[];
}) {
  return Math.random() / 10 + 0.001;
}

export function maxAngVelConst(args: {
  index: number;
  num: number;
  boundary: Iparallelepiped;
  positions: Vector3[];
}) {
  return 0.08;
}
