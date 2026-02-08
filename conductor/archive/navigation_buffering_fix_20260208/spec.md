# Specification - Pac-Man Navigation & Buffering Fix

## Overview
Currently, Pac-Man's movement logic fails to correctly handle "buffered" turns. When a player requests a direction change before reaching an intersection, Pac-Man stops at the center of the current tile instead of continuing to the intersection and then turning.

## Functional Requirements
- **Buffered Input:** Pac-Man must store the `requestedDirection` independently of his `currentDirection`.
- **Continuous Movement:** Pac-Man should continue moving in his `currentDirection` as long as it is not blocked by a wall, even if a `requestedDirection` is set.
- **Auto-Turn Logic:** When Pac-Man reaches the center of a tile, the engine must check if he can move in the `requestedDirection`. If yes, he turns. If no, he continues in his `currentDirection`.
- **Stopping Logic:** Pac-Man should only stop if both his `currentDirection` and `requestedDirection` are blocked by walls.

## Non-Functional Requirements
- **Performance:** Movement logic must remain efficient within the game loop.
- **Fidelity:** The turning behavior must feel responsive and match original arcade expectations.

## Acceptance Criteria
- [ ] Pressing a turn direction early (buffering) does not cause Pac-Man to stop.
- [ ] Pac-Man successfully turns at the next available intersection when a direction is buffered.
- [ ] Pac-Man continues moving forward if the buffered turn is not yet available.
- [ ] Unit tests verify that buffered inputs don't interrupt current movement.

## Out of Scope
- Changing ghost movement or targeting logic.
- Adding "cornering" (speed boosts or early turning shortcuts) unless necessary for the basic fix.
