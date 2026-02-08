# Track Specification: Arcade-Accurate Difficulty Scaling

## Overview
This track refines the game's movement, timing, and AI behaviors to match the precise technical specifications of the 1980 Pac-Man arcade version. This includes level-based speed tables, ghost house exit logic, and Blinky's "Cruise Elroy" behavior.

## Functional Requirements
- **Arcade Data Tables (`src/arcadeData.ts`):**
    - Implement the exact percentage-based speed tables for Pac-Man and Ghosts (Base speed, Frightened speed, Tunnel speed).
    - Implement the Frightened Mode duration table (seconds) per level.
    - Implement the Scatter/Chase timing table per level.
- **Pac-Man Movement Refinement:**
    - **Eating Penalty:** Implement a ~10% speed reduction while Pac-Man is consuming a dot or power pellet.
    - **Base Speed:** Adjust Pac-Man's base speed per level according to the data table.
- **Ghost AI & Movement Refinement:**
    - **Cruise Elroy:** Blinky (Red Ghost) must increase speed twice per level when the number of dots remaining reaches specific thresholds (e.g., 20 dots and 10 dots).
    - **House Exit Logic:** Implement the "Personal" and "Global" dot counters for ghost house exits to replace the current simple timer.
    - **Frightened/Tunnel Speed:** Adjust ghost speed accurately when frightened or passing through the side tunnels.
- **Level Progression:**
    - Ensure `GameState` correctly updates all speed and timing variables upon level transition.

## Technical Requirements
- **Configuration:** All arcade parameters MUST be centralized in `src/arcadeData.ts` for precision and easy auditing.
- **TDD:** Write unit tests for the dot counter logic and speed calculation formulas before implementation.

## Acceptance Criteria
- [ ] Pac-Man's speed decreases correctly while eating dots.
- [ ] Blinky's speed increases at the correct "Cruise Elroy" dot thresholds.
- [ ] Ghosts leave the house based on dot consumption counters rather than just time.
- [ ] Frightened mode duration decreases correctly as the level increases (matching arcade tables).
- [ ] All speed percentages match the 1980 arcade specifications across different levels.
