import { Vector3 } from "three";
import { Iparallelepiped } from "../shapes";
import vec from "../vetores";

export function allAtRest(args: {
  index: number;
  num: number;
  boundary: Iparallelepiped;
  positions: Array<Vector3>;
}) {
  return vec(0, 0, 0);
}

export function angVelRandom(args: {
  index: number;
  num: number;
  boundary: Iparallelepiped;
  positions: Array<Vector3>;
}) {
  return vec().randomDirection();
}

export function angVelBiggerAtCenter(args: {
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
  return vec()
    .randomDirection()
    .multiplyScalar(dr / (dr * dr + 0.5));
}
