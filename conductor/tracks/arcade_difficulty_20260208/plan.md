# Track Implementation Plan: Arcade-Accurate Difficulty Scaling

## Phase 1: Foundation & Data Tables [checkpoint: 77979f3]
- [x] Task: Implement Arcade Data Tables (`src/arcadeData.ts`) (0717a9a)
    - [ ] Write Tests: Level-based speed and timing data integrity
    - [ ] Implement: Centralized tables for speed, frightened duration, and scatter/chase timings
- [x] Task: Conductor - User Manual Verification 'Phase 1: Foundation & Data Tables' (Protocol in workflow.md)

## Phase 2: Pac-Man Movement & Speed
- [x] Task: Pac-Man Speed Logic & Eating Penalty (cc4b287)
    - [ ] Write Tests: Speed calculation including level base speed and eating penalty
    - [ ] Implement: Update `PacMan` class to handle variable speed and consumption penalty
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Pac-Man Movement & Speed' (Protocol in workflow.md)

## Phase 3: Ghost AI & Behavior
- [x] Task: Cruise Elroy Logic (d70e11e)
    - [ ] Write Tests: Blinky's speed increase based on dots remaining
    - [ ] Implement: Update `Ghost` class for Cruise Elroy state
- [x] Task: Ghost House Exit dot counters (9194a25)
    - [ ] Write Tests: Personal and Global dot counter logic for house exit
    - [ ] Implement: Replace timer-based exit with dot counters
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Ghost AI & Behavior' (Protocol in workflow.md)

## Phase 4: Global Timing & Level Progression
- [ ] Task: Level-Based Timing Integration
    - [ ] Write Tests: Frightened mode and Scatter/Chase transitions per level
    - [ ] Implement: Update `GameState` to use accurate arcade timing tables
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Global Timing & Level Progression' (Protocol in workflow.md)
