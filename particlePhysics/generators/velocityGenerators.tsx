import { Vector3 } from "three";
import { Iparallelepiped } from "../shapes";
import vec from "../vetores";

export function allAtRest(args: {
  index: number;
  num: number;
  boundary: Iparallelepiped;
  positions: Vector3[];
}) {
  return vec(0, 0, 0);
}

export function randomVelocity(args: {
  index: number;
  num: number;
  boundary: Iparallelepiped;
  positions: Vector3[];
}) {
  return vec().randomDirection();
}

export function sphericalSwirl(args: {
  index: number;
  num: number;
  boundary: Iparallelepiped;
  positions: Vector3[];
}) {
  let pos = vec().copy(args.positions[args.index]);
  let x = pos.x;
  let y = pos.y;
  let z = pos.z;
  let vx = z / (z * z + 0.1);
  let vy = -y;
  let vz = -x / (x * x + 0.1);
  return vec(vx, vy, vz);
}
