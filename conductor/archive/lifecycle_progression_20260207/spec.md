# Track lifecycle_progression_20260207 Specification

## Goal
Implement full game lifecycle management, including player lives, level progression, and UI state screens (Ready, Game Over).

## Scope
- Implementation of a life counter system (starting with 3 lives).
- Visual representation of remaining lives at the bottom of the maze.
- "Ready!" message display at level start and after life loss.
- Level completion logic:
    - Detect when all dots and pellets are eaten.
    - Brief pause and maze flashing animation.
    - Increment level counter and reset maze state.
- Progressive difficulty:
    - Increase ghost speed per level.
    - Decrease frightened mode duration per level.
- "Game Over" state and screen when lives reach zero.
- Transition back to start state after Game Over.

## Technical Details
- **UI:** Expand `ScoringUI` or create `GameUI` for message overlays and life icons.
- **State Machine:** Enhance `GameState` to include `READY`, `PLAYING`, `LEVEL_COMPLETE`, and `GAME_OVER` states.
- **Difficulty Scaling:** Use Level-based lookups for ghost speed and frightened timers.

## Acceptance Criteria
- [ ] Game starts with a "Ready!" message and 3 life icons at the bottom.
- [ ] Losing a life displays "Ready!" again and resets positions.
- [ ] Losing the last life displays "Game Over".
- [ ] Clearing the maze triggers a brief pause/flash and advances to Level 2.
- [ ] Level 2 has faster ghosts and shorter blue-ghost time than Level 1.
