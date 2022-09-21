import { Vector3 } from "three";
import { Iparallelepiped } from "../shapes";

export function maxSpeedConstOne(args: {
  index: number;
  num: number;
  boundary: Iparallelepiped;
  positions: Vector3[];
}) {
  return 0.2;
}

export function maxSpeedConstSmall(args: {
  index: number;
  num: number;
  boundary: Iparallelepiped;
  positions: Vector3[];
}) {
  return 0.01;
}

export function maxSpeedConstMedium(args: {
  index: number;
  num: number;
  boundary: Iparallelepiped;
  positions: Vector3[];
}) {
  return 0.06;
}
