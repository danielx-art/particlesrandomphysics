import { Vector3 } from "three";
import { Iparallelepiped } from "../shapes";

export function momentInertiaSmall(args: {
  index: number;
  num: number;
  boundary: Iparallelepiped;
  positions: Array<Vector3>;
}) {
  return 0.001;
}

export function momentInertiaBig(args: {
  index: number;
  num: number;
  boundary: Iparallelepiped;
  positions: Array<Vector3>;
}) {
  return 1;
}

export function momentInertiaConstMedium(args: {
  index: number;
  num: number;
  boundary: Iparallelepiped;
  positions: Vector3[];
}) {
  return 0.05;
}

export function momentInertiaRandom(args: {
  index: number;
  num: number;
  boundary: Iparallelepiped;
  positions: Vector3[];
}) {
  return Math.random() + 0.1;
}
