import * as THREE from 'three';
import { settings } from './settings.js';

// Theme: "Lantern night". A paper lantern stands on a stool next to a mug. my-interaction.js lights the lantern.
// Lab 1, Task 4: `mine` is the lantern (shape, color, size, position); the stool and mug are the scale cue; the point light is the glow.
//  - `mine` stays 0.5 m to 5 m from the start (0, 0, 0): it is about 1.8 m away, ahead and to the left.
//  - Scale cue: a stool with a 0.45 m seat height and a mug 0.1 m tall (real sizes a person knows).
//  - The point light is warm orange and sits inside the lantern, so the lantern is the light source.
export function addMyContent(scene) {
  // The lantern: a paper cylinder, 0.26 m tall, standing on the seat. `mine` must stay one Mesh (main.js sets castShadow and visible on it).
  const paper = new THREE.MeshStandardMaterial({ color: 0xd84315, roughness: 0.7, emissive: 0xffa040, emissiveIntensity: 0 });
  const mine = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.26, 24), paper);
  mine.name = 'lantern';
  mine.position.set(-0.8, 0.58, -1.6);                  // seat top 0.45 m + half of 0.26 m
  scene.add(mine);

  const light = new THREE.PointLight(0xffa040, 1, 6);   // dim at first: lit() raises it
  light.position.copy(mine.position);
  scene.add(light);

  // my-interaction.js calls this, so the lantern's look stays in this file.
  let isLit = false;
  mine.userData.lit = (on) => {
    isLit = on;
    light.intensity = on ? 10 : 1;   // the lit lantern lights the scene around it
  };

  // The scale cue: a stool (seat 0.45 m high) with a mug (0.1 m tall) on the seat, beside the lantern.
  const wood = new THREE.MeshStandardMaterial({ color: 0x8d6e63, roughness: 0.8 });
  const stool = new THREE.Group();
  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.04, 0.35), wood);
  seat.position.y = 0.43;                                      // top of the seat at 0.45 m
  stool.add(seat);
  for (const [x, z] of [[-0.14, -0.14], [0.14, -0.14], [-0.14, 0.14], [0.14, 0.14]]) {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.41, 8), wood);
    leg.position.set(x, 0.205, z);
    stool.add(leg);
  }
  const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.035, 0.1, 16), new THREE.MeshStandardMaterial({ color: 0xeceff1, roughness: 0.4 }));
  mug.position.set(0.13, 0.5, 0);                              // 0.45 m seat + half of 0.1 m, at the edge of the seat
  stool.add(mug);
  stool.position.set(-0.8, 0, -1.6);
  stool.traverse((o) => { if (o.isMesh) o.castShadow = o.receiveShadow = true; });
  scene.add(stool);

  return {
    mine,
    update(t) {
      // The paper glows when lit, with a slow flicker. Reduced motion keeps the glow steady.
      const flicker = settings.reducedMotion ? 0 : 0.2 * Math.sin(t * 6);
      paper.emissiveIntensity = isLit ? 1.2 + flicker : 0;
    },
  };
}
