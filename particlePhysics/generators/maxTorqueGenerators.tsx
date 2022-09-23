import { Vector3 } from "three";
import { Iparallelepiped } from "../shapes";

export function maxTorqueConst05(args: {
  index: number;
  num: number;
  boundary: Iparallelepiped;
  positions: Vector3[];
}) {
  return 0.5;
}

export function maxTorqueConstSmall(args: {
  index: number;
  num: number;
  boundary: Iparallelepiped;
  positions: Vector3[];
}) {
  return 0.1;
}

export function maxTorqueConstMedium(args: {
  index: number;
  num: number;
  boundary: Iparallelepiped;
  positions: Vector3[];
}) {
  return 0.2;
}
