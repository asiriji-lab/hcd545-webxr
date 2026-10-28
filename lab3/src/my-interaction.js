import * as THREE from 'three';
import { settings, onChange } from './settings.js';

// Theme: "Lantern night" (the lantern is made in my-scene.js). A short experience with a clear start, a task and an end:
//   start : a green "Match" sphere. Look at it to strike the match.
//   task  : an orange "Wick" cylinder. Look at it for the dwell time to light the lantern.
//   end   : a gold "Blow out" sphere, and the lantern glows. Look at it to blow the lantern out and start again.
// The state machine is:   start  ->  task  ->  end  ->  (reset)  ->  start
// safe.js calls reset() from its Restart and Exit targets, so everything that changes with the state is set in go().
// A gaze target is any Object3D with userData.target = { label, onActivate, setHover }.
export function addMyTargets({ scene, gaze, captions, audio }) {
  const lantern = scene.getObjectByName('lantern');   // made in my-scene.js; null if that file is changed
  const root = new THREE.Group();
  root.position.set(-1.2, 1.2, -2);                    // behind and above the lantern, clear of the solids in scene.js
  scene.add(root);

  let state = 'start';
  const make = (geometry, color, label, onActivate) => {
    const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color, emissive: 0x000000 }));
    mesh.userData.target = {
      label,
      onActivate,
      setHover: (on) => mesh.material.emissive.setHex(on ? 0x666666 : 0x000000),
    };
    root.add(mesh);
    gaze.add(mesh);
    return mesh;
  };

  // Every target is at least 0.3 m wide, about 2.4 m away: about 7 degrees, above the 3 degree guideline.
  const startMarker = make(new THREE.SphereGeometry(0.25, 24, 16), 0x2ecc71, 'Match',
    () => go('task', '[start] Match struck. Look at the orange wick to light the lantern'));
  const wick = make(new THREE.CylinderGeometry(0.15, 0.15, 0.5, 24), 0xff7043, 'Wick',
    () => go('end', '[done] The lantern is lit. Look at the gold sphere to blow it out and try again'));
  const endMarker = make(new THREE.SphereGeometry(0.25, 24, 16), 0xffc107, 'Blow out',
    () => go('start', '[reset] The lantern is out. Look at the green match to begin again'));

  // Each step stands in its own place, so the user has to look at the next object on purpose. (If they shared one spot, a single
  // long look would run start > task > end without a decision.)
  startMarker.position.y = 0.5;    // above the wick
  endMarker.position.y = -0.5;     // below the wick

  function go(next, message) {
    state = next;
    startMarker.visible = state === 'start';
    wick.visible = state === 'task';
    endMarker.visible = state === 'end';
    lantern?.userData.lit?.(state === 'end');   // the lantern glows only in the end state: Restart and Exit put it out too
    if (message) captions.say(message, 4);
  }

  // The reset path: put the experience back to its first state (called by safe.js; also useful in the console: hcd.mine.reset()).
  function reset() { go('start'); }

  root.scale.setScalar(settings.targetScale);
  onChange((key) => { if (key === 'targetScale') root.scale.setScalar(settings.targetScale); });
  reset();

  return { root, cube: wick, reset, get state() { return state; } };
}
