# Implementation Plan - Pac-Man Navigation & Buffering Fix

Fix the issue where Pac-Man stops prematurely when a direction is buffered before an intersection.

## Phase 1: Investigation & Test Setup
- [x] Task: Create a reproduction test in `src/pacman.test.ts` that specifically simulates buffering a turn and verifies that Pac-Man continues moving until the intersection. [7598aa0]
- [x] Task: Run tests and confirm the reproduction test fails (Red Phase). [7598aa0]
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Investigation & Test Setup' (Protocol in workflow.md)

## Phase 2: Improved Movement & Buffering Logic
- [x] Task: Implement immediate reversal logic (if `nextDirection` is opposite to `currentDirection`, turn instantly). [7598aa0]
- [x] Task: Update the `update` loop in `src/pacman.ts` to allow Pac-Man to continue in his `currentDirection` even if a `nextDirection` is buffered, until he is aligned with a tile center where the turn is possible. [d5f2a1b]
- [x] Task: Refactor `canMove` or intersection detection to ensure Pac-Man can only turn when centrally aligned with a tile, preventing "corner clipping" or premature stops. [d5f2a1b]
- [x] Task: Verify that the reproduction test now passes (Green Phase). [d5f2a1b]
- [x] Task: Run all existing tests in `src/pacman.test.ts` and `src/collision.test.ts` to ensure no regressions. [d5f2a1b]
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Improved Movement & Buffering Logic' (Protocol in workflow.md)

## Phase 3: Verification & Cleanup
- [x] Task: Perform a final code review of the movement logic to ensure it adheres to arcade-accurate principles (e.g., no stopping at intersections if a direction is held). [f71e29d]
- [x] Task: Run full test suite with coverage check (>80%). [f71e29d]
- [x] Task: Conductor - User Manual Verification 'Phase 3: Verification & Cleanup' (Protocol in workflow.md)
