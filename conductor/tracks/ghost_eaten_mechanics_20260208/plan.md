# Implementation Plan: Ghost Eaten Mechanics & House Return

## Phase 1: Foundation & State Management
- [x] Task: Define `GhostState` enum (NORMAL, FRIGHTENED, EATEN, ENTERING_HOUSE, REGENERATING) and update `Ghost` class to support these states. ec4a5bb
- [x] Task: Implement `setEaten()` method in `Ghost` class to handle speed increase and visual change to "eyes". ec4a5bb
- [x] Task: Add `isEaten` or `state` property to `Ghost` class and update rendering logic to show only eyes when in `EATEN` or `ENTERING_HOUSE` state. ec4a5bb
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Foundation & State Management' (Protocol in workflow.md)

## Phase 2: The Eaten Interaction (Freeze-Frame)
- [x] Task: Implement `pause()` and `resume()` capability in the main game loop (likely via a `pauseTimer` in `GameState`). 442e21e
- [x] Task: Update `main.ts` collision logic: when a ghost is eaten, set `pauseTimer` to 60 frames. 442e21e
- [x] Task: Implement visibility toggle in `PacMan` and `Ghost` classes to hide them during the freeze-frame. 442e21e
- [x] Task: Ensure `ScoringUI.showScorePopup` remains visible while the rest of the game is paused. 442e21e
- [ ] Task: Conductor - User Manual Verification 'Phase 2: The Eaten Interaction (Freeze-Frame)' (Protocol in workflow.md)

## Phase 3: Return Navigation & Regeneration
- [x] Task: Update `Ghost.update()` to target tile (14, 14) when in `EATEN` state. ec4a5bb
- [x] Task: Implement logic for the ghost to transition from `EATEN` to `ENTERING_HOUSE` once tile (14, 14) is reached. ec4a5bb
- [x] Task: Implement the move from house entrance to the ghost's specific home position. ec4a5bb
- [x] Task: Implement `REGENERATING` state: ghost returns to normal/frightened appearance and exits the house via existing `GhostHouseManager` logic. ec4a5bb
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Return Navigation & Regeneration' (Protocol in workflow.md)

## Phase 4: Integration & Refinement
- [x] Task: Verify ghost score multiplier correctly resets ONLY when frightened mode ends, not per ghost eaten. 442e21e
- [x] Task: Ensure "eyes" movement is significantly faster (e.g., 2.0x base speed). ec4a5bb
- [x] Task: Final polish of animations and transitions between states. ec4a5bb
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Integration & Refinement' (Protocol in workflow.md)