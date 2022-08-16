import { Iparallelepiped } from "../shapes";
import { Tparticle } from "../types";

export function wrapAround(particle: Tparticle, boundary: Iparallelepiped) {
  let maxX = boundary.x + boundary.hw;
  let minX = boundary.x - boundary.hw;
  let maxY = boundary.y + boundary.hh;
  let minY = boundary.y - boundary.hh;
  let maxZ = boundary.z + boundary.hd;
  let minZ = boundary.z - boundary.hd;
  if (particle.pos.x > maxX) particle.pos.x = minX;
  if (particle.pos.x < minX) particle.pos.x = maxX;
  if (particle.pos.y > maxY) particle.pos.y = minY;
  if (particle.pos.y < minY) particle.pos.y = maxY;
  if (particle.pos.z > maxZ) particle.pos.z = minZ;
  if (particle.pos.z < minZ) particle.pos.z = maxZ;
}

export function wrapBounce(particle: Tparticle, boundary: Iparallelepiped) {
  let maxX = boundary.x + boundary.hw;
  let minX = boundary.x - boundary.hw;
  let maxY = boundary.y + boundary.hh;
  let minY = boundary.y - boundary.hh;
  let maxZ = boundary.z + boundary.hd;
  let minZ = boundary.z - boundary.hd;
  if (particle.pos.x > maxX) {
    particle.pos.x = maxX;
    particle.vel.x *= -1;
  }
  if (particle.pos.x < minX) {
    particle.pos.x = minX;
    particle.vel.x *= -1;
  }
  if (particle.pos.y > maxY) {
    particle.pos.y = maxY;
    particle.vel.y *= -1;
  }
  if (particle.pos.y < minY) {
    particle.pos.y = minY;
    particle.vel.y *= -1;
  }
  if (particle.pos.z > maxZ) {
    particle.pos.z = maxZ;
    particle.vel.z *= -1;
  }
  if (particle.pos.z < minZ) {
    particle.pos.z = minZ;
    particle.vel.z *= -1;
  }
}
