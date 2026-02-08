# Track dots_pellets_scoring_20260207 Specification

## Goal
Implement the core gameplay loop of eating dots/pellets, triggering frightened mode, and tracking/displaying the player's score.

## Scope
- Interaction logic for Pac-Man to consume dots and power pellets.
- Removal of consumed items from the maze rendering.
- Triggering the "Frightened" state for all ghosts upon consuming a power pellet.
- Scoring engine: 10 pts for dots, 50 pts for pellets, and increasing rewards for ghosts (200, 400, 800, 1600).
- Basic UI display for "1UP" current score and "HIGH SCORE".
- Ghost "Eaten" logic: sending a ghost back to the house when consumed in frightened mode.

## Technical Details
- **State Management:** Update `MAZE_DATA` or a clone to track dot presence.
- **Rendering:** Update `MazeRenderer` to allow efficient removal of dots/pellets without a full redraw if possible, or simple re-render.
- **UI:** Pixi.js `Text` objects for score display.
- **Event Bus:** Use a simple event or callback system to notify ghosts of mode changes.

## Acceptance Criteria
- [ ] Dots disappear when Pac-Man passes over their tile center.
- [ ] Power pellets disappear and all ghosts turn blue.
- [ ] Score increases by 10 for every dot eaten.
- [ ] Score increases by 50 for every power pellet eaten.
- [ ] Eating a blue ghost increases score and returns the ghost to the starting house position.
- [ ] Current score and high score are displayed at the top of the canvas.
