# Track ghost_ai_interaction_20260207 Specification

## Goal
Implement the four unique ghost AI personalities and their interaction with Pac-Man, including mode switching and collision detection.

## Scope
- Implementation of a base Ghost class and specific logic for Blinky, Pinky, Inky, and Clyde.
- Original targeting algorithms (Chase mode) for each ghost.
- State machine for Scatter, Chase, and Frightened modes.
- Global timer for Scatter/Chase transitions.
- Ghost house behavior and exit conditions.
- Collision detection between Pac-Man and ghosts resulting in life loss.

## Technical Details
- **AI Logic:** Pure TypeScript logic to match the 1980 arcade specifications.
- **Rendering:** Ghost sprites (placeholders for now) rendered via Pixi.js.
- **State Management:** A centralized or ghost-specific state machine to handle behavior changes.
- **Intersection Logic:** Ghosts decide their next direction at the center of intersections based on their target tile.

## Acceptance Criteria
- [ ] Four ghosts are rendered in the maze.
- [ ] Blinky (Red) pursues Pac-Man directly.
- [ ] Pinky (Pink) targets the tile 4 spaces ahead of Pac-Man.
- [ ] Inky (Cyan) uses a complex target based on Blinky and Pac-Man.
- [ ] Clyde (Orange) alternates between pursuit and fleeing to his corner.
- [ ] Ghosts switch between Scatter and Chase modes based on the standard arcade timer.
- [ ] Collision between Pac-Man and a non-frightened ghost reduces the life count and resets the level.
