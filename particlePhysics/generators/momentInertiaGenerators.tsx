import { Vector3 } from "three";
import { Iparallelepiped } from "../shapes";
import vec from "../vetores";

export function momentInertiaConst1000(args: {
  index: number;
  num: number;
  boundary: Iparallelepiped;
  positions: Array<Vector3>;
}) {
  return 1000;
}

export function momentInertia1(args: {
  index: number;
  num: number;
  boundary: Iparallelepiped;
  positions: Array<Vector3>;
}) {
  return 1;
}

export function momentInertiaConst10000(args: {
  index: number;
  num: number;
  boundary: Iparallelepiped;
  positions: Array<Vector3>;
}) {
  return 10000;
}

export function momentInertiaRandom(args: {
  index: number;
  num: number;
  boundary: Iparallelepiped;
  positions: Array<Vector3>;
}) {
  return Math.random() * 5000 + 5000;
}
