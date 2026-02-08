# Track Implementation Plan: Fruit & Bonus Items

## Phase 1: Data and Core Spawning [checkpoint: 578907e]
- [x] Task: Define Fruit Types and Level Mapping (66e0cf5)
    - [ ] Write Tests: Correct fruit type and score value for all levels (1-13+)
    - [ ] Implement: `FruitType` enum and `LEVEL_FRUIT_DATA` mapping
- [x] Task: Implement Spawning Triggers (20f2fd7)
    - [ ] Write Tests: Fruit spawn event at 70 and 170 dots eaten
    - [ ] Implement: Logic in `GameState` or a new `FruitManager` to track dot count and trigger spawning
- [x] Task: Implement Expiration and Lifecycle (4ed8cd3)
    - [ ] Write Tests: Fruit disappears after timer (9.5s) or on Pac-Man death
    - [ ] Implement: Timer-based despawning and reset logic during `loseLife`
- [x] Task: Conductor - User Manual Verification 'Phase 1: Data and Core Spawning' (Protocol in workflow.md)

## Phase 2: Interaction and Scoring
- [x] Task: Fruit Collision Logic (3c2e77a)
    - [ ] Write Tests: Detection of Pac-Man overlapping the fruit spawn point
    - [ ] Implement: Collision detection between Pac-Man and the active fruit
- [ ] Task: Scoring and Score Popup UI
    - [ ] Write Tests: Score increases by correct amount and popup appears/disappears
    - [ ] Implement: Update `ScoringEngine` and create a temporary `ScorePopup` UI component
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Interaction and Scoring' (Protocol in workflow.md)

## Phase 3: Rendering and Assets
- [ ] Task: Fruit Sprite Rendering
    - [ ] Implement: Add fruit sprites to the rendering loop and position them at the spawn point
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Rendering and Assets' (Protocol in workflow.md)
