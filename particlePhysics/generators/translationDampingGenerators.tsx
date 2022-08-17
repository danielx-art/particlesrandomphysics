import { Vector3 } from "three";
import { Iparallelepiped } from "../shapes";
import vec from "../vetores";

export function noTranslationDamp(args: {
  index: number;
  num: number;
  boundary: Iparallelepiped;
  positions: Array<Vector3>;
}) {
  return 1;
}

// export function smallTranslationDamp(args: {
//   index: number;
//   num: number;
//   boundary: Iparallelepiped;
//   positions: Vector3[];
// }) {
//   return 0.999;
// }

// export function TranslationDamp09(args: {
//   index: number;
//   num: number;
//   boundary: Iparallelepiped;
//   positions: Vector3[];
// }) {
//   return 0.9;
// }
