# Track core_engine_maze_20260207 Specification

## Goal
Establish the foundational game engine and render the classic Pac-Man maze with basic movement and collision detection.

## Scope
- Project initialization with Vite, TypeScript, and Pixi.js.
- Definition of the original Pac-Man maze layout as a data structure.
- Rendering of the maze walls, dots, and power pellets.
- Implementation of Pac-Man's continuous, tile-based movement.
- Basic collision detection against maze walls.
- Implementation of "pre-turning" and tunnel wrapping.

## Technical Details
- **Rendering:** Pixi.js for the game canvas.
- **Testing:** Vitest for unit testing game logic.
- **Architecture:** Separation of concerns between game state (data) and rendering logic (Pixi.js).
- **Movement:** Tile-based logic to ensure Pac-Man stays aligned with the grid, with pixel-perfect velocity matching the arcade.

## Acceptance Criteria
- [ ] Game initializes and displays a canvas.
- [ ] The classic maze is rendered correctly according to original dimensions.
- [ ] Dots and power pellets are placed accurately.
- [ ] Pac-Man can be moved using keyboard arrows.
- [ ] Pac-Man stops at walls and cannot move through them.
- [ ] Pre-turning works (holding a key before an intersection turns Pac-Man at the first possible moment).
- [ ] Tunnel wrapping works (exiting the side of the screen reappears on the opposite side).
