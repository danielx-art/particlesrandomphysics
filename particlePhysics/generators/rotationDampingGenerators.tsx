import { Vector3 } from "three";
import { Iparallelepiped } from "../shapes";

export function noRotationDamp(args: {
  index: number;
  num: number;
  boundary: Iparallelepiped;
  positions: Vector3[];
}) {
  return 1;
}

export function smallRotationDamp(args: {
  index: number;
  num: number;
  boundary: Iparallelepiped;
  positions: Vector3[];
}) {
  return 0.999;
}

export function rotationDamp09(args: {
  index: number;
  num: number;
  boundary: Iparallelepiped;
  positions: Vector3[];
}) {
  return 0.9;
}
