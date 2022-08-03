import { Vector3 } from "three";
import { Iparallelepiped } from "../shapes";

export function massAllOne(args: {
  index: number;
  num: number;
  boundary: Iparallelepiped;
  positions: Array<Vector3>;
}) {
  return 1;
}

export function massAllRandom(args: {
  index: number;
  num: number;
  boundary: Iparallelepiped;
  positions: Array<Vector3>;
}) {
  return Math.random() * 1000 + 1;
}

export function massBiggerAtCenter(args: {
  index: number;
  num: number;
  boundary: Iparallelepiped;
  positions: Array<Vector3>;
}) {
  let pos = args.positions[args.index];
  let x = pos.x;
  let y = pos.y;
  let z = pos.z;
  let dr = pos.distanceTo(args.boundary.center);
  return 1000 * (dr / (dr * dr + 0.5));
}
