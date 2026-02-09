# Implementation Plan: Ghost Eyes Entrance Bug Fix

## Phase 1: Diagnosis & Reproducing Tests
- [x] Task: Create `src/ghostEntrance.test.ts` to simulate an `EATEN` ghost reaching tile (14, 14). 77cd7cf
- [x] Task: Write a failing test (Red Phase) that confirms the ghost fails to move into the `ENTERING_HOUSE` state or gets blocked by the door. 77cd7cf
- [x] Task: Conductor - User Manual Verification 'Phase 1: Diagnosis & Reproducing Tests' (Protocol in workflow.md) [checkpoint: 77cd7cf]

## Phase 2: Fix Entrance & Door Collision
- [x] Task: Refine the distance threshold in `Ghost.update()` for transitioning from `EATEN` to `ENTERING_HOUSE` to ensure it doesn't "skip" the trigger point. 77cd7cf
- [x] Task: Update `Ghost.canMove()` or `handleEntering()` logic to explicitly allow `ENTERING_HOUSE` ghosts to pass through `MazeTile.GHOST_HOUSE_DOOR`. 77cd7cf
- [x] Task: Fix the "bouncing" behavior by ensuring the ghost snaps to the center of tile (14, 14) before starting the downward descent. 77cd7cf
- [x] Task: Verify the fix with the newly created tests (Green Phase). 77cd7cf
- [x] Task: Conductor - User Manual Verification 'Phase 2: Fix Entrance & Door Collision' (Protocol in workflow.md) [checkpoint: 77cd7cf]

## Phase 3: Integration & Final Verification
- [x] Task: Run the full test suite to ensure no regressions in ghost movement or state transitions. 77cd7cf
- [x] Task: Perform manual verification in the browser to ensure eyes of all four ghosts reliably enter the house. 77cd7cf
- [x] Task: Conductor - User Manual Verification 'Phase 3: Integration & Final Verification' (Protocol in workflow.md) [checkpoint: 77cd7cf]