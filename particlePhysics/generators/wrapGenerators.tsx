import { Vector3 } from "three";
import { Iparallelepiped } from "../shapes";
import { Iparticle } from "../types";
import vec from "../vetores";

export function wrapAround(particle: Iparticle, boundary: Iparallelepiped) {
  let bottomWall = self.boundary.y + self.boundary.height / 2;
  let topWall = self.boundary.y - self.boundary.height / 2;
  let rightWall = self.boundary.x + self.boundary.width / 2;
  let leftWall = self.boundary.x - self.boundary.width / 2;

  if (particle.pos.x >= rightWall) particle.pos.x = leftWall + 1;
  if (particle.pos.y >= bottomWall) particle.pos.y = topWall + 1;
  if (particle.pos.x <= leftWall) particle.pos.x = rightWall - 1;
  if (particle.pos.y <= topWall) particle.pos.y = bottomWall - 1;

  // bounce:
  //     if (self.particles[i].pos.x >= rightWall)
  //     self.particles[i].vel.x *= -1;
  //     if (self.particles[i].pos.y >= bottomWall)
  //     self.particles[i].vel.y *= -1;
  //     if (self.particles[i].pos.x <= leftWall)
  //     self.particles[i].vel.x *= -1;
  //     if (self.particles[i].pos.y <= topWall) self.particles[i].vel.y *= -1;
  //
}
