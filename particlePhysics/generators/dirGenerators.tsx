import { Vector3 } from "three";
import { Iparallelepiped } from "../shapes";
import vec from "../vetores";

export function randomDir(args: {
  index: number;
  num: number;
  boundary: Iparallelepiped;
  positions: Vector3[];
}) {
  return vec().randomDirection();
}

export function dirPointInOut(args: {
  index: number;
  num: number;
  boundary: Iparallelepiped;
  positions: Vector3[];
}) {
  let pos = args.positions[args.index];
  let x = pos.x;
  let y = pos.y;
  let z = pos.z;
  let invert = Math.random() < 0.5 ? -1 : 1;
  return vec(x, y, z).normalize().multiplyScalar(invert);
}
