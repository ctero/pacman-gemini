# Track Specification: Fruit & Bonus Items

## Overview
This track implements the bonus fruit mechanics found in the original arcade version of Pac-Man. Fruits provide a significant score boost and appear twice per level based on dot consumption.

## Functional Requirements
- **Spawning Logic:**
    - Fruit appears in the maze when Pac-Man has eaten 70 dots.
    - A second fruit appears when 170 dots have been eaten.
- **Duration:** 
    - Each fruit remains on screen for a duration between 9 and 10 seconds.
    - If not eaten within this time, it disappears.
    - Fruit disappears immediately if Pac-Man loses a life.
- **Placement:** 
    - Fruit spawns at the classic location directly below the ghost house (approximate coordinates: 13.5 * TILE_SIZE, 20 * TILE_SIZE).
- **Progression & Scoring:**
    - Fruit types and values follow the arcade level progression:
        - Level 1: Cherry (100 pts)
        - Level 2: Strawberry (300 pts)
        - Level 3-4: Peach (500 pts)
        - Level 5-6: Apple (700 pts)
        - Level 7-8: Grapes (1000 pts)
        - Level 9-10: Galaxian Boss (2000 pts)
        - Level 11-12: Bell (3000 pts)
        - Level 13+: Key (5000 pts)
- **Consumption:**
    - When Pac-Man overlaps the fruit, the score is added immediately.
    - The fruit sprite is replaced by a "score popup" (e.g., "100") for 2 seconds.

## Visual Requirements
- **Sprites:** Unique sprites for each fruit type.
- **Animations:** No internal animation for the fruit itself, but a temporary text-based or sprite-based score popup upon consumption.

## Acceptance Criteria
- [ ] Fruit spawns correctly at 70 and 170 dots.
- [ ] Fruit disappears after ~9.5 seconds if not eaten.
- [ ] Fruit type corresponds correctly to the current level.
- [ ] Eating fruit adds the correct points to the score.
- [ ] Score popup appears and then fades/disappears after 2 seconds.
- [ ] Fruit is cleared on life loss or level completion.
