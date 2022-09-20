import { Vector3 } from "three";
import { Iparallelepiped } from "../shapes";
import vec from "../vetores";

export function randomDir(args: {
  index: number;
  num: number;
  boundary: Iparallelepiped;
  positions: Vector3[];
}) {
  let dir = vec().randomDirection();
  return dir;
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
  let dir =
    pos.x === 0 && pos.y === 0 && pos.z === 0
      ? vec().randomDirection()
      : vec(x, y, z).normalize().multiplyScalar(invert);
  return dir;
}
