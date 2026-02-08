# Track animations_audio_20260207 Specification

## Goal
Enhance the visual and auditory experience with arcade-accurate animations and sound effects.

## Scope
- Implementation of frame-based animations for Pac-Man (chomping, directional rotation).
- Ghost animations (leg movement, eye direction based on movement, frightened/flashing states).
- Integration of Howler.js for sound effects:
    - Intro theme (at game start).
    - Siren (looping during normal play).
    - Waka-waka (chomping dots).
    - Power pellet siren.
    - Ghost eaten sound.
    - Death sound.
- Synchronizing animations with movement speed.

## Technical Details
- **Animations:** Use Pixi.js `AnimatedSprite` or manual frame management in `update` loops.
- **Assets:** Source or generate placeholders for original arcade sprites and WAV/MP3 sound files.
- **Audio Management:** Use a global `AudioManager` wrapper around Howler.js.
- **Rotation:** Rotate Pac-Man's sprite based on his `direction`.

## Acceptance Criteria
- [ ] Pac-Man has a 3-frame chomping animation that rotates to face his movement direction.
- [ ] Ghosts have a 2-frame leg animation.
- [ ] Ghost eyes face the direction they are moving.
- [ ] Ghosts flash white/blue when the frightened timer is nearly expired.
- [ ] The intro theme plays when the page loads or level starts.
- [ ] The "waka-waka" sound plays continuously while Pac-Man eats dots.
- [ ] The siren pitch changes or state changes when a power pellet is active.
