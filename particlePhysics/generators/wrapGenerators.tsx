import { Iparallelepiped } from "../shapes";
import { Tparticle } from "../types";

export function wrapAround(particle: Tparticle, boundary: Iparallelepiped) {
  let maxY = boundary.y + boundary.hh;
  let minY = boundary.y - boundary.hh;
  let maxX = boundary.x + boundary.hw;
  let minX = boundary.x - boundary.hw;
  let minZ = boundary.z + boundary.hd;
  let maxZ = boundary.z - boundary.hd;

  if (particle.pos.x >= maxX) particle.pos.x = minX + 1;
  if (particle.pos.x <= minX) particle.pos.x = maxX - 1;
  if (particle.pos.y >= maxY) particle.pos.y = minY + 1;
  if (particle.pos.y <= minY) particle.pos.y = maxY - 1;
  if (particle.pos.z >= maxZ) particle.pos.z = minZ + 1;
  if (particle.pos.z <= minZ) particle.pos.z = maxZ - 1;
}

export function wrapBounce(particle: Tparticle, boundary: Iparallelepiped) {
  let maxY = boundary.y + boundary.hh;
  let minY = boundary.y - boundary.hh;
  let maxX = boundary.x + boundary.hw;
  let minX = boundary.x - boundary.hw;
  let minZ = boundary.z + boundary.hd;
  let maxZ = boundary.z - boundary.hd;

  if (particle.pos.x >= maxX) {
    particle.pos.x = maxX;
    particle.vel.x *= -1;
  }
  if (particle.pos.x <= minX) {
    particle.pos.x = minX;
    particle.vel.x *= -1;
  }
  if (particle.pos.y >= maxY) {
    particle.pos.y = maxY;
    particle.vel.y *= -1;
  }
  if (particle.pos.y <= minY) {
    particle.pos.y = minY;
    particle.vel.y *= -1;
  }
  if (particle.pos.y >= maxZ) {
    particle.pos.z = maxZ;
    particle.vel.z *= -1;
  }
  if (particle.pos.y <= minZ) {
    particle.pos.z = minZ;
    particle.vel.z *= -1;
  }
}
