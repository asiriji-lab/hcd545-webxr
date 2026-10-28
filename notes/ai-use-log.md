# AI-use log

Feeds README section 10 (AI-use log). One row per use. You must be able to explain every line.
"What I changed after" is yours to fill in: write what you actually changed, or "nothing yet" until you do.

| Date | Tool | Purpose | File(s) | What I changed after |
|---|---|---|---|---|
| 2026-10-28 | Claude Code (Claude Sonnet 5.5) | Asked it to set up my repo: copy the Lab 3 starter into `lab3/`, add a GitHub Pages workflow and a home page that lists each lab | `lab3/` (starter, unchanged), `.github/workflows/deploy.yml`, `.github/scripts/build-site.sh`, `.gitignore` | nothing yet |
| 2026-10-28 | Claude Code (Claude Sonnet 5.5) | Asked it to build my Lab 1 scene (theme "Lantern night"): a lantern, a stool and mug as the scale cue, and a warm point light | `lab3/src/my-scene.js` | nothing yet |
| 2026-10-28 | Claude Code (Claude Sonnet 5.5) | Asked it to build my start > task > end experience: strike a match, light the wick, blow out the lantern | `lab3/src/my-interaction.js` | nothing yet |

Not done with AI, because it must come from my own tests: the dwell default in `lab3/src/settings.js`, the comfort presets in `lab3/src/my-comfort.js`, my device matrix, FPS readings and trial results.

## Lines I will be asked about (oral, 8 minutes: demo, questions, live change)

`lab3/src/my-interaction.js`
- `go(next, message)`: why every visual change is set here from `state` (the Restart and Exit targets in `safe.js` only call `reset()`, which calls `go('start')`).
- `gaze.add(mesh)` and `userData.target = { label, onActivate, setHover }`: how a looked-at object becomes a target (`src/gaze.js`).
- The two `root.scale` lines: why the Target size setting applies to my objects.
- Why the three targets sit at different heights: one long look must not run start > task > end by itself.

`lab3/src/my-scene.js`
- `mine.userData.lit` and `scene.getObjectByName('lantern')`: how the interaction file finds and lights the lantern without `main.js` changing.
- The `update(t)` flicker: why it stops when `settings.reducedMotion` is on.
- Stool seat 0.45 m, mug 0.1 m: the real sizes used as a scale cue.

Live change practice: change the dwell time, change the lantern color, add a fourth step.
