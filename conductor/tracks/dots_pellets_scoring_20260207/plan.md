# Track Implementation Plan: dots_pellets_scoring_20260207

## Phase 1: Consumption Mechanics
- [ ] Task: Dynamic Maze State
    - [ ] Write Tests: Maze state initialization and item removal
    - [ ] Implement: Logic to track which dots/pellets remain in the maze
- [ ] Task: Eating Logic
    - [ ] Write Tests: Pac-Man eating dots and pellets based on position
    - [ ] Implement: Collision check between Pac-Man and maze items
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Consumption Mechanics' (Protocol in workflow.md)

## Phase 2: Power Pellets and Ghost Interaction
- [ ] Task: Trigger Frightened Mode
    - [ ] Write Tests: Global mode switch on pellet consumption
    - [ ] Implement: Logic to set all ghosts to FRIGHTENED mode
- [ ] Task: Eating Ghosts
    - [ ] Write Tests: Scoring and ghost reset when eaten
    - [ ] Implement: Logic to handle Pac-Man overlapping a frightened ghost
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Power Pellets and Ghost Interaction' (Protocol in workflow.md)

## Phase 3: Scoring and UI
- [ ] Task: Scoring Engine
    - [ ] Write Tests: Score accumulation rules
    - [ ] Implement: Logic to track current and high scores
- [ ] Task: Scoring UI
    - [ ] Write Tests: UI text initialization
    - [ ] Implement: Display current and high score using Pixi.js Text
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Scoring and UI' (Protocol in workflow.md)
